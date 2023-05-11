var express = require('express');
var router = express.Router();
const { mentorModel } = require('../schemas/mentorSchema');
const { studentModel } = require('../schemas/studentschema');
const mongoose = require('mongoose');
const { dbUrl } = require('../common/dbconfig');
mongoose.connect(dbUrl)


/* GET mentor listing. */
router.get('/', async function (req, res) {
  try {
    let mentor = await mentorModel.find({});
    if (!mentor) {
      res.send("mentor data is empty")
    } else {
      res.status(200).send({
        mentor,
        message: "Mentor Data Fetch Successfull!"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })
  }
});

/*create mentor*/
router.post('/create', async (req, res) => {
  try {
    let mentor = await mentorModel.findOne({ name: req.body.name })
    console.log(mentor)
    if (!mentor) {
      let mentor = await mentorModel.create(req.body)
      res.status(201).send({
        message: "Mentor create Successfull!"
      })
    }
    else {
      res.status(400).send({ message: "Mentor Alread Exists!" })
    }

  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })
  }
})


//Add student name mentor list & mentor name add the student
router.post('/:name', async (req, res) => {
  try {
    let mentor = await mentorModel.findOne({ name: req.params.name })
    console.log(mentor);
    let mentorlist = req.params.name
    console.log(mentorlist);
    if (mentor) {
     let studentList = req.body.students
      console.log(studentList);
      let studentData = await studentModel.findOne({ name: studentList })
      console.log(studentData);
      if (studentData) {
        await mentorModel.findOneAndUpdate(
          {
            name: mentorlist
          },
          {
            $push: { students: studentList }

          }
        )
        await studentModel.findOneAndUpdate(
          {
            name: studentList
          },
          {
            $push: { mentors: mentorlist }
          }
        )
        res.status(200).send({
          message: "Student Add Successful!"
        })
      } else {
        res.status(400).send({ message: "Student Does Not Exists!" })
      }
    }
    else {
      res.status(400).send({ message: "invalide" })
    }

  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })
  }
})



module.exports = router;
