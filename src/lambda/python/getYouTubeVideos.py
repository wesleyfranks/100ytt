import os
import json
import requests
import base64
from datetime import datetime
from urllib.parse import quote_plus

def base64_encode(content):
    return base64.b64encode(content.encode()).decode()

def lambda_handler(event, context):
    VITE_YT_API_KEY = os.environ['VITE_YT_API_KEY']
    VITE_YT_CHANNEL_ID = os.environ['VITE_YT_CHANNEL_ID']
    VITE_GITHUB_TOKEN = os.environ['VITE_GITHUB_TOKEN']
    VITE_GITHUB_REPO = os.environ['VITE_GITHUB_REPO']  # e.g., 'username/100ytt'
    VITE_GITHUB_FILE_PATH = os.environ['VITE_GITHUB_FILE_PATH']  # e.g., 'path/to/videos.json'
    VITE_FILTER_DATE_STR = os.environ.get('VITE_FILTER_DATE', '2024-12-31T00:00:00Z')
    VITE_FILTER_DATE = datetime.strptime(VITE_FILTER_DATE_STR, '%Y-%m-%dT%H:%M:%SZ')

    YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'
    params = {
        'part': 'snippet',
        'maxResults': 50,
        'order': 'date',
        'type': 'video',
        'publishedAfter': VITE_FILTER_DATE_STR,
        'channelId': VITE_YT_CHANNEL_ID,
        'key': VITE_YT_API_KEY
    }

    try:
        response = requests.get(YOUTUBE_API_URL, params=params)
        response.raise_for_status()
        youtube_data = response.json()

        new_videos = []
        for item in youtube_data.get('items', []):
            video = {
                'id': {'videoId': item['id']['videoId']},
                'snippet': {
                    'title': item['snippet']['title'],
                    'publishedAt': item['snippet']['publishedAt'],
                    'thumbnails': {
                        'medium': {
                            'url': item['snippet']['thumbnails']['medium']['url']
                        }
                    }
                }
            }
            new_videos.append(video)

        # Fetch existing videos.json from GitHub
        github_api_url = f'https://api.github.com/repos/{VITE_GITHUB_REPO}/contents/{quote_plus(VITE_GITHUB_FILE_PATH)}'
        headers = {
            'Authorization': f'token {VITE_GITHUB_TOKEN}',
            'Accept': 'application/vnd.github.v3.raw'
        }
        get_response = requests.get(github_api_url, headers=headers)
        get_response.raise_for_status()
        existing_videos = get_response.json()

        existing_video_ids = {video['id']['videoId'] for video in existing_videos}
        unique_new_videos = [
            video for video in new_videos
            if video['id']['videoId'] not in existing_video_ids
        ]

        if not unique_new_videos:
            return {
                'statusCode': 200,
                'body': json.dumps('No new videos to add. videos.json is up to date.')
            }

        updated_videos = unique_new_videos + existing_videos
        updated_videos.sort(
            key=lambda x: datetime.strptime(x['snippet']['publishedAt'], '%Y-%m-%dT%H:%M:%SZ'),
            reverse=True
        )

        updated_content = json.dumps(updated_videos, indent=2)

        # Fetch the file SHA
        file_info_response = requests.get(
            github_api_url,
            headers={
                'Authorization': f'token {VITE_GITHUB_TOKEN}',
                'Accept': 'application/vnd.github.v3+json'
            }
        )
        file_info_response.raise_for_status()
        file_info = file_info_response.json()
        file_sha = file_info['sha']

        # Update the videos.json file in GitHub on the 'build' branch
        update_data = {
            'message': 'Update videos.json via AWS Lambda - Add new unique videos',
            'content': base64_encode(updated_content),
            'sha': file_sha,
            'branch': 'build'  # <-- KEY CHANGE: specify the branch here
        }
        update_response = requests.put(
            github_api_url,
            headers={
                'Authorization': f'token {VITE_GITHUB_TOKEN}',
                'Accept': 'application/vnd.github.v3+json'
            },
            data=json.dumps(update_data)
        )
        update_response.raise_for_status()

        return {
            'statusCode': 200,
            'body': json.dumps(f'videos.json updated successfully on build branch with {len(unique_new_videos)} new videos.')
        }

    except requests.exceptions.RequestException as e:
        print(f'HTTP Request failed: {e}')
        return {
            'statusCode': 500,
            'body': json.dumps('Failed to update videos.json due to an HTTP error.')
        }
    except Exception as e:
        print(f'An error occurred: {e}')
        return {
            'statusCode': 500,
            'body': json.dumps('An unexpected error occurred while updating videos.json.')
        }