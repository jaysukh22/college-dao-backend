import { Router } from "express";
import passport from "passport";
import { fileUploader } from "./../middlewares/uploader";

import {
  getAllCourse,
  getOneCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseCount,
  searchCourse,
  Setlevel,
  getStudentCourse,
} from "../controllers/courseController";
import { addNotification } from "../controllers/notificationcontroller";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const course = await getAllCourse(req.query);
      res.send(course);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.get(
  "/student",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const course = await getStudentCourse(req.query);
      res.send(course);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const course = await searchCourse(req.query);
      res.send(course);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.get(
  "/search/level",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const course = await Setlevel(req.query);
      res.send(course);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const course = await getOneCourse(req.params.id);
      res.send(course);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const payload = req.body;
      console.log(payload);
      if (payload.banner[0]) {
        payload.banner = await fileUploader(payload.banner[0].path);
      }
      if (payload.modules.length > 0) {
        await Promise.all(
          payload.modules.map(async (module, mindex) => {
            await Promise.all(
              module.items.map(async (item, index) => {
                if (item.data.file[0]) {
                  item.data.file = await fileUploader(item.data.file[0].path);
                }
              })
            );
          })
        );
      }
      const result = await addCourse(payload);

      //Send Notification
      if (res.status(200) && payload.status === 'pending') {
        let data = {
          type: "course_create",
          courseId: result._id,
          courseName: result.title,
          createdBy: result.createdBy,
        };
        await addNotification(data);
      }

      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const payload = req.body;

      if (payload.banner !== undefined && payload.banner[0]) {
        payload.banner = await fileUploader(payload.banner[0].path);
      }
      if (payload.modules !== undefined && payload.modules.length > 0) {
        await Promise.all(
          payload.modules.map(async (module) => {
            await Promise.all(
              module.items.map(async (item) => {
                if (typeof item.data.file !== "string" && item.data.file[0]) {
                  item.data.file = await fileUploader(item.data.file[0].path);
                }
              })
            );
          })
        );
      }

      const result = await updateCourse(payload);

      //Send Notification
      if (res.status(200) && payload.status === 'pending') {
        let data = {
          type: "course_update",
          courseId: result._id,
          courseName: result.title,
          createdBy: result.createdBy,
          approvals: payload.approvals === 'course_update' ? 'course_update': 'course_approve'
        };
        await addNotification(data);
      }

      if (res.status(200) && payload.status === 'approve') {
        let data = {
          type: "course_approve",
          courseId: result._id,
          courseName: result.title,
          createdBy: result.createdBy,
          approvals: payload.approvals === 'course_update' ? 'course_update': 'course_approve'
        };
        await addNotification(data);
      }
      
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const payload = req.body;
      console.log("payload", payload);
      // if (payload.banner !== undefined && payload.banner[0]) {
      //   payload.banner = await fileUploader(payload.banner[0].path);
      // }
      // if (payload.modules !== undefined && payload.modules.length > 0) {
      //   await Promise.all(
      //     payload.modules.map(async (module) => {
      //       await Promise.all(
      //         module.items.map(async (item) => {
      //           if (typeof item.data.file !== "string" && item.data.file[0]) {
      //             item.data.file = await fileUploader(item.data.file[0].path);
      //           }
      //         })
      //       );
      //     })
      //   );
      // }

      const result = await updateCourse(payload);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await deleteCourse(req.params.id);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post(
  "/count",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await getCourseCount(req.body);
      res.send({ data: result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

export default router;
