//hints
console.group('How to use');
console.log("To get a list of tags use %cgetTags()", "color: blue");
console.log("To set a list of tags use %csetTags(['tag1', 'tag2', ...])", "color: blue");
console.log("To add tag use %caddTag('tag')", "color: blue");
console.log("if you want to delete tag by name use %cremoveTagByName('tag')", "color: blue");
console.log("if you want to delete tag by number use %cremoveTagByNumber(number)", "color: blue");
console.log("If you want to turn on readonly use %creadonlyModeOn()", "color: blue");
console.log("If you want to turn off readonly use %creadonlyModeOff()", "color: blue");
console.groupEnd();
//

//get elements
const btn = document.querySelector('button'),
    input = document.querySelector('.tag'),
    tagsArea = document.querySelector('.tags-list');

//localstorage functions
const setLocal = () => localStorage.setItem('tagList', tagsDB.tags);
const getLocal = () => localStorage.getItem('tagList');

//tags database
const tagsDB = {
    tags: []
};

//check data in local storage
if (localStorage.getItem('tagList')) {
    localStorage.getItem('tagList').split(',').forEach(i => {
        tagsDB.tags.push(i);
        return tagsDB.tags;
    });
}

// render list of tags
function createTagsList(tags, parent = tagsArea) {
    parent.innerHTML = '';
    tags.forEach((tag, i) => {
        parent.innerHTML += `
            <li class="tag-item">${i+1} ${tag}
                <div class="delete"></div>
            </li>
        `;
    });
    document.querySelectorAll('.delete').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            if (check) {
                alert('You can\'t do this in readonly mode');
            } else {
                btn.parentElement.remove();
                tagsDB.tags.splice(i, 1);
                createTagsList(tags);
                setLocal();
            }
        });
    });
}

//add new tag by input
btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!input.value) {
        alert('Enter the tag');

    } else {
        let newTag = input.value;
        tagsDB.tags.push(newTag);
        createTagsList(tagsDB.tags, tagsArea);
        input.value = '';
        setLocal();
    }
});

//getters/setters
const setTags = (...[tagsArr]) => {
    if (!tagsArr) {
        throw new Error("Add tags in format ['tag1', 'tag2', ...]");
    } else if (check) {
        throw new Error('You can\'t do this in readonly mode');
    } else {
        [...tagsDB.tags] = tagsArr;
        createTagsList(tagsDB.tags, tagsArea);
        localStorage.setItem('tagList', tagsDB.tags);
    }
};
const addTag = (tag) => {
    if (!tag) {
        throw new Error('There are no empty tags :)');
    } else if (check) {
        throw new Error('You can\'t do this in readonly mode');
    } else {
        tagsDB.tags.push(tag);
        createTagsList(tagsDB.tags);
        setLocal();
    }
};
const removeTagByNumber = (i) => {
    if (!tagsDB.tags[i - 1]) {
        throw new Error('Tag with this number doesn\'t exist');
    } else if (check) {
        throw new Error('You can\'t do this in readonly mode');
    } else {
        createTagsList(tagsDB.tags);
        tagsDB.tags.splice(i - 1, 1);
        createTagsList(tagsDB.tags);
        setLocal();
    }
};
const removeTagByName = (tag) => {
    createTagsList(tagsDB.tags);
    if (tagsDB.tags.lastIndexOf(tag) === -1) {
        throw new Error('Invalid tag name');
    } else if (check) {
        throw new Error('You can\'t do this in readonly mode');
    } else {
        tagsDB.tags.splice(tagsDB.tags.lastIndexOf(tag), 1);
        console.log(`You've removed tag <${tag}>`);
        createTagsList(tagsDB.tags);
        setLocal();
    }
};
const getTags = () => {
    return tagsDB.tags.length == 0 ? 'There is no tags' :
        tagsDB.tags.join(', ');
};

//Readonly mode
let readonlyMode = document.querySelector('#readonlyMode');
let check = readonlyMode.checked;
const funcReadonly = (check) => {
    if (check) {
        input.setAttribute('disabled', 'true');
        btn.setAttribute('disabled', 'true');
    } else {
        input.removeAttribute('disabled');
        btn.removeAttribute('disabled');
    }
};
readonlyMode.addEventListener('click', () => {
    check = !check;
    funcReadonly(check);
});
const addReadOnly = () => {
    check = true;
    readonlyMode.checked = true;
    funcReadonly(check);
};
const removeReadOnly = () => {
    check = false;
    readonlyMode.checked = false;
    funcReadonly(check);
};

createTagsList(tagsDB.tags);
