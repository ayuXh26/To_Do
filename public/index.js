const button = document.getElementById("add-button");
const logout = document.getElementById("logout");

// container in which the task will be added
const task_list = document.getElementById("task_list");
const input = document.getElementById("task_input");

const url = "https://to-do-backend-7000.onrender.com";

// let position = 0;

/*
    getting all the task added till now when the page refreshes
*/
const getAlltasks = async () => {
  const response = await fetch(`${url}/task`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Server error:", text);
    return [];
  }

  const data = await response.json();
  return data;
};

const refreshTask = async () => {
  task_list.replaceChildren();

  getAlltasks()
    .then((result) => {
      result.forEach((task) => {
        const taskName = task.taskName;
        const task_id = task._id;

        const container = document.createElement("div");
        container.id = task_id;
        container.classList.add("task-container");

        const text = document.createElement("p");
        text.textContent = taskName;
        text.style.fontSize = "18px";
        text.style.marginTop = "10px";

        const done = document.createElement("button");
        done.type = "button";
        done.className = "done btn btn-outline-success";
        done.innerHTML = `<i class="bi bi-check-circle"></i> Done`;

        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "edit btn btn-outline-secondary";
        edit.innerHTML = `<i class="bi bi-pencil"></i> Edit`;

        container.appendChild(text);
        container.appendChild(done);
        container.appendChild(edit);

        task_list.appendChild(container);
      });
    })
    .then(() => {
      const deleteButton = document.querySelectorAll(".done");
      deleteButton.forEach((button) => {
        button.addEventListener("click", async (e) => {
          e.preventDefault();

          const taskId = e.target.closest("div").id;
          await fetch(`${url}/todo/delete/${taskId}`, {
            method: "DELETE",
            headers: {
              "content-type": "application/json",
            },
            credentials: "include",
          });

          refreshTask();
        });
      });

      const editButton = document.querySelectorAll(".edit");
      editButton.forEach((button) => {
        button.addEventListener("click", async (e) => {
          e.preventDefault();

          const userInput = prompt("Enter the new task details:");
          if (userInput) {
            const taskId = e.target.closest("div").id;
            await fetch(`${url}/todo/edit/${taskId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ userInput }),
            });

            refreshTask();
          }
        });
      });
    });
};

/*
    to prevent the task from disappearing when refresh button is clicked
*/
window.addEventListener("DOMContentLoaded", refreshTask);

/*
    adding the task to the task_list div when the user click to Add button
*/
button.addEventListener("click", async (e) => {
  e.preventDefault();

  const taskName = input.value.trim();
  if (!taskName) return;

  await fetch(`${url}/create-task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ taskName }),
  });

  refreshTask();
  input.value = "";
});

logout.addEventListener("click", async (e) => {
  e.preventDefault();

  const logout = await fetch(`${url}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!logout.ok) {
    const errData = await logout.json();
    alert(errData.message || errData.error || "Login failed");
    return;
  }

  window.location.href = "login.html";
});
