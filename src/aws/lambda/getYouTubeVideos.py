import os
import json
import requests
import base64
from datetime import datetime
from urllib.parse import quote_plus

def base64_encode(content):
    """
    Encodes the given content to Base64.
    """
    return base64.b64encode(content.encode()).decode()

def lambda_handler(event, context):
    """
    AWS Lambda handler to fetch YouTube videos and update GitHub's videos.json.
    """
    # Retrieve environment variables
    YOUTUBE_API_KEY = os.environ['YOUTUBE_API_KEY']
    YOUTUBE_CHANNEL_ID = os.environ['YOUTUBE_CHANNEL_ID']
    GITHUB_TOKEN = os.environ['GITHUB_TOKEN']
    GITHUB_REPO = os.environ['GITHUB_REPO']  # e.g., 'username/100ytt'
    GITHUB_FILE_PATH = os.environ['GITHUB_FILE_PATH']  # e.g., 'path/to/videos.json'
    FILTER_DATE_STR = os.environ.get('FILTER_DATE', '2024-12-31T00:00:00Z')
    FILTER_DATE = datetime.strptime(FILTER_DATE_STR, '%Y-%m-%dT%H:%M:%SZ')

    # YouTube API Endpoint
    YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

    # Parameters for YouTube API
    params = {
        'part': 'snippet',
        'maxResults': 50,
        'order': 'date',
        'type': 'video',
        'publishedAfter': FILTER_DATE_STR,
        'channelId': YOUTUBE_CHANNEL_ID,
        'key': YOUTUBE_API_KEY
    }

    try:
        # Fetch videos from YouTube
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
        github_api_url = f'https://api.github.com/repos/{GITHUB_REPO}/contents/{quote_plus(GITHUB_FILE_PATH)}'
        headers = {
            'Authorization': f'token {GITHUB_TOKEN}',
            'Accept': 'application/vnd.github.v3.raw'
        }
        get_response = requests.get(github_api_url, headers=headers)
        get_response.raise_for_status()
        existing_videos = get_response.json()

        # Extract existing video IDs for quick lookup
        existing_video_ids = {video['id']['videoId'] for video in existing_videos}

        # Filter new videos to exclude duplicates
        unique_new_videos = [
            video for video in new_videos
            if video['id']['videoId'] not in existing_video_ids
        ]

        if not unique_new_videos:
            return {
                'statusCode': 200,
                'body': json.dumps('No new videos to add. videos.json is up to date.')
            }

        # Combine new unique videos with existing videos
        updated_videos = unique_new_videos + existing_videos

        # Optionally, sort the videos by publishedAt in descending order
        updated_videos.sort(
            key=lambda x: datetime.strptime(x['snippet']['publishedAt'], '%Y-%m-%dT%H:%M:%SZ'),
            reverse=True
        )

        # Prepare content for GitHub (JSON)
        updated_content = json.dumps(updated_videos, indent=2)

        # Get the current file SHA for update
        # Fetch file metadata to obtain the SHA
        file_info_response = requests.get(
            github_api_url,
            headers={
                'Authorization': f'token {GITHUB_TOKEN}',
                'Accept': 'application/vnd.github.v3+json'
            }
        )
        file_info_response.raise_for_status()
        file_info = file_info_response.json()
        file_sha = file_info['sha']

        # Update the videos.json file in GitHub
        update_response = requests.put(
            github_api_url,
            headers={
                'Authorization': f'token {GITHUB_TOKEN}',
                'Accept': 'application/vnd.github.v3+json'
            },
            data=json.dumps({
                'message': 'Update videos.json via AWS Lambda - Add new unique videos',
                'content': base64_encode(updated_content),
                'sha': file_sha
            })
        )
        update_response.raise_for_status()

        return {
            'statusCode': 200,
            'body': json.dumps(f'videos.json updated successfully with {len(unique_new_videos)} new videos.')
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