const router = require("express").Router();
const Workout = require("../models/workout");

router.post("/api/workouts"),
  ({ body }, res) => {
    Workout.create({})
      .then((getLastWorkout) => {
        res.json(getLastWorkout);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

router.put("/api/workouts/:id", ({ body, params }, res) => {
  Workout.findByIdAndUpdate(
    params.id,
    { $push: { exercises: body } },
    { new: true, runValidators: true }
  )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/api/workouts", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: "$exercises.duration",
        },
      },
    },
  ])
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: "$exercises.duration",
        },
      },
    },
  ])
    .sort({ _id: -1 })
    .limit(7)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete("/api/workouts", (req, res) => {
  Workout.findByIdAndDelete(req.body.id)
    .then(() => {
      res.json(true);
    })

    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
