import Notification from "../models/notification";

// export const notify = async (data) => {
//   return await Notification.create(data);
// };

export const getNotification = async (param) => {
  const query = { type: { $in: param.type } }
  return await Notification.find(query)
  // if (enterPrise !== null) {
  //   return await Notification.find({
  //     notificationFor: notification,
  //     enterPrise: enterPrise,
  //   });
  // } else if (enterPrise === null) {
  //   return await Notification.find({
  //     notificationFor: notification,
  //   });
  // }
};

export const addNotification = async (notification) => {
  return await Notification.create(notification);
};

export const updateNotification = async (notification) => {
  return await Notification.findByIdAndUpdate(notification._id);
};
