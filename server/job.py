import os
import time
from datetime import datetime
import schedule
from dotenv import load_dotenv
from mongodb_utils import fetch_all_activities, db
from call import call

load_dotenv()

def get_current_time():    
    return datetime.now().strftime("%H:%M")

def get_current_date():    
    return datetime.now().strftime("%Y-%m-%d")

def execute_scheduled_job(activity_data):
    try:
        user_id = activity_data.get("user_id", "unknown")
        description = activity_data.get("description", "your scheduled activity")
        print(f"\n=== EXECUTING SCHEDULED JOB ===")
        print(f"Time: {get_current_time()}")
        print(f"Activity: {description}")
        print(f"User: {user_id}")
        response = call(activity_data)
        if hasattr(response, 'status_code') and response.status_code == 200:
            print("Call successfully initiated!")
        else:
            print(f"Call failed or no response object.")
    except Exception as e:
        print(f"Error executing scheduled job: {e}")

def check_activities(activities, executed_one_time):    
    current_time = get_current_time()
    current_date = get_current_date()
    print(f"\n[LOG] Current time: {current_time}, Current date: {current_date}")
    job_executed = False
    for activity in activities:
        activity_type = activity.get("type")
        tags = activity.get("tags", [])
        metadata = activity.get("metadata", {})
        is_one_time = (
            activity_type == "one_time" or
            (isinstance(tags, list) and "one_time" in tags) or
            (isinstance(metadata, dict) and metadata.get("method") == "one_time")
        )
        if is_one_time:
            timestamp_str = activity.get("timestamp")
            activity_date = None
            activity_time = None
            if timestamp_str:
                try:
                    # Expecting format: YYYY-MM-DDTHH:MM:SS
                    activity_date, time_part = timestamp_str.split('T')
                    activity_time = time_part[:5]  # HH:MM
                except Exception as e:
                    print(f"[ERROR] Invalid timestamp format for activity '{activity.get('name', activity.get('_id', 'unknown'))}': {timestamp_str}")
            print(f"[LOG] One-time/manual activity '{activity.get('name', activity.get('_id', 'unknown'))}' scheduled for {activity_date} at {activity_time} (from timestamp: {timestamp_str})")
            print(f"[LOG] Comparing: scheduled_date={activity_date} == current_date={current_date} and scheduled_time={activity_time} == current_time={current_time}")
            key = f"{activity.get('name', activity.get('_id', 'unknown'))}_{activity_date}_{activity_time}"
            if activity_date == current_date and activity_time == current_time and key not in executed_one_time:
                print(f"[MATCH] One-time/manual activity '{activity.get('name', activity.get('_id', 'unknown'))}' scheduled for now ({current_time})")
                execute_scheduled_job(activity)
                executed_one_time.add(key)
                job_executed = True
        elif activity_type == "recurring":
            # Try to get days and recurringTimes from multiple possible locations
            days = activity.get("days")
            recurring_times = activity.get("recurringTimes")
            # Fallback to form or metadata.form_data if not found at top level
            if not days or not recurring_times:
                form = activity.get("form", {})
                if not days:
                    days = form.get("days")
                if not recurring_times:
                    recurring_times = form.get("recurringTimes")
            if not days or not recurring_times:
                metadata = activity.get("metadata", {})
                form_data = metadata.get("form_data", {})
                if not days:
                    days = form_data.get("days")
                if not recurring_times:
                    recurring_times = form_data.get("recurringTimes")
            days = days or []
            recurring_times = recurring_times or {}
            today = datetime.now().strftime("%a")  # e.g., 'Mon'
            print(f"[LOG] Recurring activity '{activity.get('name', activity.get('_id', 'unknown'))}' days: {days} recurringTimes: {recurring_times}")
            if today in days:
                scheduled_time = recurring_times.get(today)
                print(f"[LOG] Today is {today}. Scheduled time for today: {scheduled_time}")
                print(f"[LOG] Comparing: scheduled_time={scheduled_time} == current_time={current_time}")
                key = f"{activity.get('name', activity.get('_id', 'unknown'))}_{today}_{scheduled_time}_{current_date}"
                if scheduled_time == current_time and key not in executed_one_time:
                    print(f"[MATCH] Recurring activity '{activity.get('name', activity.get('_id', 'unknown'))}' scheduled for now ({current_time}) on {today}")
                    execute_scheduled_job(activity)
                    executed_one_time.add(key)
                    job_executed = True
    return job_executed

def run_scheduler():
    print("Starting TingTing job scheduler (rewritten)...")
    executed_one_time = set()
    while True:
        try:
            activities = fetch_all_activities()
            print(f"[LOG] Refetched {len(activities)} activities from database.")
            for activity in activities:
                print(f"[LOG] Activity ID: {activity.get('_id', 'unknown')}, Timestamp: {activity.get('timestamp', 'N/A')}")
        except Exception as e:
            print(f"[ERROR] Could not refetch activities: {e}")
            activities = []
        job_executed = check_activities(activities, executed_one_time)
        if job_executed:
            time.sleep(60)  # Sleep 60 seconds if a job was executed
        else:
            time.sleep(10)  # Otherwise, check again in 10 seconds

if __name__ == "__main__":
    run_scheduler()