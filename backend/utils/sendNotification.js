const Notification = require("../models/Notification");

/**
 * createNotification - create notification doc for multiple users
 * @param {Array<ObjectId>} userIds - array of User ObjectIds
 * @param {String} message - message string
 * @param {String} type - type string
 * @param {ObjectId} relatedTask - optional task id
 * @param {String} actionLink - optional frontend link
 */
const createNotification = async ({ userIds = [], message, type = "general", relatedTask = null, actionLink = null }) => {
  if (!userIds || userIds.length === 0) return null;
  const notif = new Notification({
    users: userIds,
    message,
    type,
    relatedTask,
    actionLink,
    isReadBy: [],
  });
  await notif.save();
  return notif;
};

module.exports = { createNotification };
