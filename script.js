
// Updated saveNotes function to make an HTTP POST request to the server
const saveNotes = async () => {
  const notes = document.querySelectorAll(".note");
  const data = [];
  notes.forEach(note => {
    const content = note.querySelector(".content").value;
    const title = note.querySelector(".title").value;
    data.push({ title, content });
  });

  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save notes');
    }

    const responseData = await response.json();
    showNotification(responseData.message, 'success');
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

// Updated loadNotes function to make an HTTP GET request to the server
const loadNotes = async () => {
  try {
    const response = await fetch('/api/notes');
    if (!response.ok) {
      throw new Error('Failed to load notes');
    }

    const notes = await response.json();
    notes.forEach(note => {
      addNote(note.content, note.title);
    });
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

// Modified addNote function to remove local storage operations and handle UI only
const addNote = (text = "", title = "") => {
  const note = document.createElement("div");
  note.classList.add("note");
  note.innerHTML = ` 
    <div class="icons"> 
         <i class="save fas fa-save" 
             style="color:red"> 
         </i> 
         <i class="trash fas fa-trash" 
             style="color:yellow"> 
         </i>  
    </div> 
    <div class="title-div"> 
        <textarea class="title" 
            placeholder="Write the title ...">${title} 
        </textarea> 
    </div> 
    <textarea class="content" 
        placeholder="Note down your thoughts ...">${text} 
    </textarea> 
    `;

  function handleTrashClick() {
    const confirmation = confirm("Are you sure you want to delete this note?");
    if (confirmation) {
      note.remove();
      saveNotes();
    }
  }

  function handleSaveClick() {
    saveNotes();
    alert("Note saved successfully!");
  }

  const delBtn = note.querySelector(".trash");
  const saveButton = note.querySelector(".save");

  delBtn.addEventListener("click", handleTrashClick);
  saveButton.addEventListener("click", handleSaveClick);

  main.appendChild(note);
};

// Function to display notification
function showNotification(message, className) {
  const notification = document.createElement("div");
  notification.className = `alert ${className}`;
  notification.appendChild(document.createTextNode(message));
  main.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000); // Remove notification after 3 seconds
}

// Load notes when the page is loaded
loadNotes();
