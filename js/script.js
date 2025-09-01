import { auth, db, getAuth } from "./config.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  deleteDoc,
  setDoc,
} from "./methods.js";
import {
  closeModal,
  hideLoader,
  loginModal,
  modalOverlay,
  showLoader,
  showModal,
  signupModal,
} from "./modal.js";

const listContainer = document.querySelector("#list-container");
const signupBtn = document.querySelector("#signupBtn");
const loginBtn = document.querySelector("#loginBtn");
const addTaskBtn = document.querySelector("#addTask");
let taskInput = document.querySelector("#task-input");
let btn = document.querySelector("#btn");
let btn1 = document.querySelector("#btn1");
let userid = null;

// CHECK USER STATE
function checkUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        userid = user.uid;
        hideLoader();
        console.log("Logged in user:", userid);
        btn1.classList.add("hide");
        btn.classList.remove("hide");

        resolve(true);
        // ...
      } else {
        // User is signed out
        // ...
        showModal();
        btn.classList.add("hide");
        btn1.classList.remove("hide");
        resolve(false);
        addTaskBtn.disabled = true;
      }
    });
  });
}

// SIGNUP LOGIC
signupBtn.addEventListener("click", () => {
  const signupEmail = document.querySelector("#signup-email");
  const signupPwd = document.querySelector("#signup-password");
  createUserWithEmailAndPassword(auth, signupEmail.value, signupPwd.value)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);
      Swal.fire("Success!", "Signedup Successfully", "success");
      window.location.reload();
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire("Error", `${errorCode} => ${errorMessage}`, "error");
    });
});

// LOGIN LOGIC
loginBtn.addEventListener("click", () => {
  showLoader();
  const loginEmail = document.querySelector("#login-email");
  const loginPwd = document.querySelector("#login-password");
  signInWithEmailAndPassword(auth, loginEmail.value, loginPwd.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      hideLoader();
      swal.fire("Success", "Logged In Successfully", "success");
      closeModal();
      showTasks();
      addTaskBtn.disabled = false;

      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire("Alert", `${errorCode} => ${errorMessage}`, "error");
      showModal();
    });
});
btn1.addEventListener("click", showModal);

// LOGOUT LOGIC
function logUserOut() {
  signOut(auth)
    .then(() => {
      listContainer.innerHTML = "";
      // Sign-out successful.
      Swal.fire("Success", "Logged Out Successfully", "success");
    })
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      // An error happened
      Swal.fire("Error", "Logout failed", "error");
    });
}
document.getElementById("btn").addEventListener("click", () => {
  logUserOut();
});

//ADD TASK FUNCTION
async function addtask() {
  if (!taskInput.value.trim()) {
    Swal.fire("Error", "Please enter a task", "error");
    hideLoader();
    return;
  }

  try {
    const docRef = await addDoc(collection(db, userid), {
      task: taskInput.value.trim(),
    });
    console.log("Document written with ID: ", docRef.id);
    hideLoader();
    taskInput.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
    Swal.fire("Error", "Failed to add task", "error");
    hideLoader();
  }
}

//  ADD NEW TASK
addTaskBtn.addEventListener("click", () => {
  showLoader();
  addtask();
});

// SHOW TASK FUNCTION
function showTasks() {
  showLoader();
  const q = query(collection(db, userid));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    listContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      let { task } = doc.data();
      console.log(doc.id);
      listContainer.innerHTML += `
          <div class="todo" role="listitem">
            <input
              type="checkbox"
              id=""
              class="complete"
              aria-label="Mark complete"
            />
            <div
              class="text"
              data-placeholder="Type your task…"
              aria-label="Edit task"
            >
              ${task}
      </div>
            <div class="actions">
              <button class="icon-btn" title="Click the text to edit" data-id="${doc.id}">
                <!-- pencil icon -->
                <svg
                  data-id="${doc.id}"
                  class="edit"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 20h9"  data-id="${doc.id}"/>
                  <path
                    d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" data-id="${doc.id}"
                  >
                </svg>
              </button>
              <button class="icon-btn" for="del-1" title="Delete task" data-id="${doc.id}">
                <!-- trash icon -->
                <svg                  
                  data-id="${doc.id}"
                  class="dlt"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="3 6 5 6 21 6" data-id="${doc.id}"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" data-id="${doc.id}"/>
                  <path d="M10 11v6" data-id="${doc.id}"/>
                  <path d="M14 11v6" data-id="${doc.id}"/>
                  <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" data-id="${doc.id}"/>
                </svg>
              </button>
            </div>
          </div>
  `;
    });
    hideLoader();
  });
}

// DELETE TASK

listContainer.addEventListener("click", async (event) => {
  const dltBtn = event.target.closest(".dlt");
  if (dltBtn) {
    showLoader();
    const taskId = event.target.dataset.id;
    await deleteDoc(doc(db, userid, taskId));
    hideLoader();
  }
});

// EDIT TASK
async function editTask(newTask, taskId) {
  const docRef = await setDoc(doc(db, userid, taskId), {
    task: newTask,
  });
  hideLoader();
}
listContainer.addEventListener("click", (event) => {
  const edditBtn = event.target.closest(".edit");
  if (edditBtn) {
    showLoader();
    let newTask = prompt("Enter new task here");
    if (newTask && newTask.trim()) {
      const taskId = event.target.dataset.id;
      console.log(taskId);
      editTask(newTask.trim(), taskId);
    } else {
      hideLoader();
      Swal.fire("Error", "Please enter a valid task", "error");
    }
  }
});

checkUser().then((loggedIn) => {
  if (loggedIn) {
    showTasks();
  }
});
