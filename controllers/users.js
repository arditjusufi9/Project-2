const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const createUsers = async (req, res) => {
  try {
     const { name, email ,role} = req.body;
  
   if (!name || !email || !role) {
        return res.status(400).json({ error: 'Add name and email' });
      }
  
    const user = await prisma.users.create({
      data: {
        name,
        email,
        role
        },
      });
  
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  };


  const deleteUsers = async (req, res) => {
    try {  
  const { name } = req.params; 
  
  const users = await prisma.users.findMany(); 
  
     
    const userToDelete = users.find((user) => user.name === name);
  
    if (!userToDelete) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
    const deletedUser = await prisma.users.delete({
      where: {
          id: userToDelete.id, 
        },
      });
  
      res.status(200).json(deletedUser);
    } catch (error) {
      console.error('Error deleting user by name:', error);
      res.status(500).json({ error: 'Deshtoi me fshi user by name' });
    }
  };

  const createTasks = async (req, res) => {
    try {
        const { task } = req.body;
        const taskName = await prisma.tasks.create({
            data: {
                task,
                TaskStatus:{
                  create:{
                    status: "to_do"
                  }
                }
            },
        });
        res.json(taskName);
        res.status(200).send('User is updated!');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error!');
    }
};

const assignTask = async (req, res) => {
  try {
    const { taskName, name, email } = req.body; 

    if (!taskName || !name || !email) {
      return res.status(400).json({ error: 'Please provide taskName, name, and email' });
    }

    const user = await prisma.users.findUnique({
      where: {
        name,
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const task = await prisma.tasks.findMany({
      where: {
        taskName,
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.tasks.update({
      where: {
        id: task.id,
      },
      data: {
        user: {
          connect: {
            id: user.id, 
          },
        },
      },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error assigning task to user:', error);
    res.status(500).json({ error: 'Failed to assign task to user' });
  }
};





const getUsers = async (req, res) => {
  try {
    const allUsers = await prisma.users.findMany(); 

    res.status(200).json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};




const getTasks = async (req, res) => {
  try {
    const allTasks = await prisma.tasks.findMany(); 
    res.status(200).json(allTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};



const deleteTasks = async (req, res) => {
  try {
    const { taskName } = req.params;

    if (!taskName) {
      return res.status(400).json({ error: 'Please provide a taskName' });
    }

    const task = await prisma.tasks.findFirst({
      where: {
        taskName,
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.tasks.delete({
      where: {
        taskName,
      },
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task by name:', error);
    res.status(500).json({ error: 'Failed to delete task by name' });
  }
};



const getUsersByTask = async (req, res) => {
  try {
    const { task } = req.params;

    if (!task) {
      return res.status(400).json({ error: 'Please provide a taskName' });
    }

    const usersWithTask = await prisma.users.findMany({
      where: {
        tasks: {
          some: {
            task,
          },
        },
      },
    });

    if (!usersWithTask || usersWithTask.length === 0) {
      return res.status(404).json({ error: 'No users found for the task' });
    }

    res.status(200).json(usersWithTask);
  } catch (error) {
    console.error('Error fetching users by task assigned:', error);
    res.status(500).json({ error: 'Failed to fetch users by task assigned' });
  }
};




const getTasksByUsersName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ error: 'Shkruaje nje emer' });
    }

    const user = await prisma.users.findFirst({
      where: {
        name: name,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const tasksByUser = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
    });

    if (!tasksByUser || tasksByUser.length === 0) {
      return res.status(404).json({ error: 'Ska taska per userin' });
    }

    res.status(200).json(tasksByUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Deshtoi marrja taskave nga emri' });
  }
};




const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!taskId || !status) {
      return res.status(400).json({ error: 'Shkruaje taskId dhe statusin' });
    }

    const updatedTask = await prisma.tasks.update({
      where: {
        id: parseInt(taskId), 
      },
      data: {
        taskStatus: status,
      },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating tasken:', error);
    res.status(500).json({ error: 'Deshtoj updatimi taskes' });
  }
};



const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Shkruje 1 status' });
    }

    const tasksByStatus = await prisma.task.findMany({
      where: {
        taskStatus: status,
      },
    });

    if (!tasksByStatus || tasksByStatus.length === 0) {
      return res.status(404).json({ error: 'Ska taska me ket status' });
    }

    res.status(200).json(tasksByStatus);
  } catch (error) {
    console.error('Error taskave prej statusit:', error);
    res.status(500).json({ error: ' Deshtoj apet' });
  }
};










module.exports={
  createUsers,
  deleteUsers,
  createTasks,
  assignTask,
  getUsers,
  getTasks,
  deleteTasks,
  getUsersByTask,
  getTasksByUsersName,
  updateTaskStatus,
  getTasksByStatus
}