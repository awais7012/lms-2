from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Body
from app.models.user import User
from app.models.notification import Notification, NotificationCreate
from app.api.deps import get_current_user
from app.db.mongodb import db
from bson import ObjectId
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=dict)
async def get_notifications(current_user: User = Depends(get_current_user)) -> Any:
    """
    Get notifications for the current user.
    """
    notifications = []
    cursor = db.notifications.find({
        "recipient_id": ObjectId(current_user.id)
    }).sort("created_at", -1)
    
    async for notification in cursor:
        notification["_id"] = str(notification["_id"])
        notification["recipient_id"] = str(notification["recipient_id"])
        if notification.get("sender_id"):
            notification["sender_id"] = str(notification["sender_id"])
        if notification.get("course_id"):
            notification["course_id"] = str(notification["course_id"])
        notifications.append(notification)
    
    # Count unread notifications
    unread_count = await db.notifications.count_documents({
        "recipient_id": ObjectId(current_user.id),
        "read": False
    })
    
    return {
        "notifications": notifications,
        "unread_count": unread_count
    }

@router.post("/mark-read/{notification_id}", response_model=dict)
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Mark a notification as read.
    """
    # Check if notification exists and belongs to the user
    notification = await db.notifications.find_one({
        "_id": ObjectId(notification_id),
        "recipient_id": ObjectId(current_user.id)
    })
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found or doesn't belong to you"
        )
    
    # Mark as read
    await db.notifications.update_one(
        {"_id": ObjectId(notification_id)},
        {"$set": {"read": True}}
    )
    
    return {"message": "Notification marked as read"}

@router.post("/mark-all-read", response_model=dict)
async def mark_all_notifications_read(current_user: User = Depends(get_current_user)) -> Any:
    """
    Mark all notifications as read.
    """
    await db.notifications.update_many(
        {"recipient_id": ObjectId(current_user.id)},
        {"$set": {"read": True}}
    )
    
    return {"message": "All notifications marked as read"}

@router.delete("/{notification_id}", response_model=dict)
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Delete a notification.
    """
    # Check if notification exists and belongs to the user
    notification = await db.notifications.find_one({
        "_id": ObjectId(notification_id),
        "recipient_id": ObjectId(current_user.id)
    })
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found or doesn't belong to you"
        )
    
    # Delete notification
    await db.notifications.delete_one({"_id": ObjectId(notification_id)})
    
    return {"message": "Notification deleted successfully"}

