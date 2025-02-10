import os
import json
import requests
import base64
from datetime import datetime
from urllib.parse import quote_plus
import boto3  # <-- new import for SNS

def base64_encode(content: str) -> str:
    return base64.b64encode(content.encode()).decode()

def lambda_handler(event, context):
    VITE_YT_API_KEY = os.environ['VITE_YT_API_KEY']
    VITE_YT_CHANNEL_ID = os.environ['VITE_YT_CHANNEL_ID']
    VITE_GITHUB_TOKEN = os.environ['VITE_GITHUB_TOKEN']
    VITE_GITHUB_REPO = os.environ['VITE_GITHUB_REPO']  # e.g. "wesleyfranks/100ytt"
    VITE_GITHUB_FILE_PATH = os.environ['VITE_GITHUB_FILE_PATH']  # e.g. "public/videos.json"
    VITE_FILTER_DATE_STR = os.environ.get('VITE_FILTER_DATE', '2024-12-31T00:00:00Z')
    VITE_FILTER_DATE = datetime.strptime(VITE_FILTER_DATE_STR, '%Y-%m-%dT%H:%M:%SZ')

    # For SNS
    SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']  # e.g. "arn:aws:sns:us-east-1:123456789012:100YTUpdates"
    sns_client = boto3.client("sns")

    YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search"
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
        # Fetch from YouTube
        yt_response = requests.get(YOUTUBE_API_URL, params=params)
        yt_response.raise_for_status()
        youtube_data = yt_response.json()

        new_videos = []
        for item in youtube_data.get("items", []):
            video = {
                "id": {"videoId": item["id"]["videoId"]},
                "snippet": {
                    "title": item["snippet"]["title"],
                    "publishedAt": item["snippet"]["publishedAt"],
                    "thumbnails": {
                        "medium": {
                            "url": item["snippet"]["thumbnails"]["medium"]["url"]
                        }
                    }
                }
            }
            new_videos.append(video)

        # GitHub: get file from build branch
        github_file_url = (
            f"https://api.github.com/repos/{VITE_GITHUB_REPO}/contents/"
            f"{quote_plus(VITE_GITHUB_FILE_PATH)}?ref=build"
        )
        headers_json = {
            "Authorization": f"token {VITE_GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json"
        }
        get_file_resp = requests.get(github_file_url, headers=headers_json)
        get_file_resp.raise_for_status()
        file_info = get_file_resp.json()

        file_sha = file_info["sha"]
        encoded_content = file_info["content"]
        decoded_text = base64.b64decode(encoded_content).decode("utf-8")
        existing_videos = json.loads(decoded_text)

        # Deduplicate
        existing_video_ids = {v["id"]["videoId"] for v in existing_videos}
        unique_new_videos = [
            v for v in new_videos
            if v["id"]["videoId"] not in existing_video_ids
        ]

        if not unique_new_videos:
            message = "No new videos to add. videos.json is up to date."
            # Publish to SNS
            sns_client.publish(
                TopicArn=SNS_TOPIC_ARN,
                Subject="100yt Videos Update from AWS",
                Message=message
            )
            return {"statusCode": 200, "body": json.dumps(message)}

        updated_videos = unique_new_videos + existing_videos
        updated_videos.sort(
            key=lambda x: datetime.strptime(x["snippet"]["publishedAt"], "%Y-%m-%dT%H:%M:%SZ"),
            reverse=True
        )

        updated_content = json.dumps(updated_videos, indent=2)
        encoded_updated_content = base64_encode(updated_content)

        # Update on build branch
        update_data = {
            "message": "Update videos.json via AWS Lambda - Add new unique videos",
            "content": encoded_updated_content,
            "sha": file_sha,
            "branch": "build"
        }
        update_resp = requests.put(
            github_file_url.replace("?ref=build", ""),  # remove ?ref=build for the PUT
            headers={
                "Authorization": f"token {VITE_GITHUB_TOKEN}",
                "Accept": "application/vnd.github.v3+json"
            },
            data=json.dumps(update_data)
        )
        update_resp.raise_for_status()

        # Success message
        success_message = (
             f"You've successfully uploaded {new_videos.count} videos to YouTube, great job!"
             "\n\n"
            f"videos.json updated successfully on build branch with {len(unique_new_videos)} new videos."
        )

        # Publish to SNS with the success output
        sns_client.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject="100yt Videos Update from AWS",
            Message=success_message
        )

        return {"statusCode": 200, "body": json.dumps(success_message)}

    except requests.exceptions.RequestException as e:
        error_msg = f"Failed to update videos.json due to an HTTP error: {e}"
        print(error_msg)
        sns_client.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject="100yt Videos Update from AWS - Error",
            Message=error_msg
        )
        return {"statusCode": 500, "body": json.dumps(error_msg)}
    except Exception as e:
        error_msg = f"An unexpected error occurred while updating videos.json: {e}"
        print(error_msg)
        sns_client.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject="100yt Videos Update from AWS - Error",
            Message=error_msg
        )
        return {"statusCode": 500, "body": json.dumps(error_msg)}