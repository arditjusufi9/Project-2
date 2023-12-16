const router = require('express').Router();


const { createUsers, createTasks, assignTask, getUsers, getTasks, deleteTasks, getUsersByTask, getTasksByUsersName } = require('../controllers/users');
const { deleteUsers,updateTaskStatus,getTasksByStatus } = require('../controllers/users')


router.post('/',createUsers)
router.delete('/:name',deleteUsers)
router.post('/tasks',createTasks)
router.put('/assign', assignTask)
router.get('/get',getUsers)
router.get('/gettasks',getTasks)
router.delete('/:task',deleteTasks)
router.get('/get/:task',getUsersByTask)
router.get('/fetch/:name', getTasksByUsersName)
router.put('/tasks/:taskId/status', updateTaskStatus);
router.get('/tasks/status/:status', getTasksByStatus); 

module.exports=router;