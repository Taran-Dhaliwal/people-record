main()

// ===================================================================================
// MAIN
// ===================================================================================

async function main() {
    let studentInformation = await fetchStudentInformation()
    constructStudentInfoElements(studentInformation.students)

    document.getElementById("Namefilter").addEventListener("keyup", filterResults)
    document.getElementById("Tagfilter").addEventListener("keyup", filterResults)
}

async function fetchStudentInformation() {
    let response = await fetch('https://api.hatchways.io/assessment/students')
    let json = await response.json()
    return json
}

function constructStudentInfoElements(studentsArray) {
    let partAContainer = document.getElementById("part-a")

    for(let student of studentsArray) {
        let studentInfoContainer = createContainerElementForStudent(student);

        studentInfoContainer.appendChild(createImageContainer(student))
        studentInfoContainer.appendChild(createContentContainer(student))
        studentInfoContainer.appendChild(createExpandButton(student))

        partAContainer.appendChild(studentInfoContainer)
    }
}

// ===================================================================================
// ===================================================================================



// ===================================================================================
// MAIN CONTAINERS 
// ===================================================================================

function createContainerElementForStudent(student) {
    let element = document.createElement("div")
    element.setAttribute("id", "student-" + student.id)
    element.setAttribute("class", "student-info-container")
    return element
}

function createImageContainer(student) {
    let container = document.createElement("div")
    container.setAttribute("class", "image-container")

    let img = document.createElement("img")
    img.setAttribute("class", "image")
    img.setAttribute("src", student.pic)

    container.appendChild(img)
    
    return container 
}

// ===================================================================================
// ===================================================================================



// ===================================================================================
// CONTENT CONTAINERS
// ===================================================================================

function createContentContainer(student) {
    let sum = student.grades.reduce((sum, current) => Number(sum) + Number(current))
    let average = sum / (student.grades.length)
    average=average+"%";

    let container = document.createElement("div")
    container.setAttribute("class", "content-container")
    
    container.appendChild(createNameElementForStudent(student))
    container.appendChild(createParagraphItem("Email", student.email))
    container.appendChild(createParagraphItem("Company", student.company))
    container.appendChild(createParagraphItem("Skill", student.skill))
    container.appendChild(createParagraphItem("Average", average))
    container.appendChild(createList(student.grades, student.id))
    container.appendChild(createTagContainer(student))
    container.appendChild(createTagInput(student))

    return container

}

function createNameElementForStudent(student) {
    let element = document.createElement("h1")
    element.setAttribute("class", "name")
    element.innerHTML = student.firstName + " " + student.lastName;

    return element
}

function createParagraphItem(key, value) {
    let parent = document.createElement("p")
    parent.innerHTML = key + ": ";

    let element = document.createElement("span")
    element.setAttribute("class", key.toLowerCase())
    element.innerHTML = value;

    parent.appendChild(element)

    return parent
}

function createList(grades, id){
    let list =  document.createElement("div")
    list.setAttribute("class", "extended")
    list.setAttribute("id", "extend-box-" + id)

    grades.forEach((grade, index) => list.appendChild(createListItem(grade, index)))
   
    return list;
}

function createListItem(grade, index){
    let parent = document.createElement("p")
    parent.innerHTML = "Test "+ Number(index+1) + ": ";

    let element = document.createElement("span")
    element.innerHTML = grade+"%";

    parent.appendChild(element)

    return parent
}

function createTagContainer(student) {
    let tagContainer = document.createElement("div")
    tagContainer.setAttribute("id", "tags-" + student.id)
    tagContainer.setAttribute("class", "tag-container")

    let tagElement = document.createElement("span")
    tagElement.setAttribute("class", "tag")
    tagElement.style.display = 'none'
    tagContainer.appendChild(tagElement)

    return tagContainer
}

function createTagInput(student){
    let form = document.createElement("form")
    let input =  document.createElement("input")
    input.setAttribute("class", "tag-input")
    input.setAttribute("placeholder", "Add a tag")
    input.setAttribute("name", "tagInput")
    input.setAttribute("data-student-id", student.id)

    
    form.addEventListener("submit", addTag)

    form.appendChild(input)
    return form
}

// ===================================================================================
// ===================================================================================



// ===================================================================================
// EXPAND BUTTON 
// ===================================================================================

function createExpandButton(student) {
    let btn = document.createElement("button")
    
    btn.setAttribute("class", "expander")
    btn.setAttribute("data-expand-list" , student.id)

    btn.innerHTML = '+'
    
    btn.addEventListener("click", toggleExpansion)
    
    return btn
}

function toggleExpansion(event) {
    let element = document.getElementById("extend-box-" + event.target.getAttribute("data-expand-list"))
    if(element.classList.contains("active")) {
        element.classList.remove("active")
        event.target.innerHTML = '+'
    }
    else {
        element.classList.add("active")
        event.target.innerHTML = '-'
    }
}

// ===================================================================================
// ===================================================================================



// ===================================================================================
// EVENTS 
// ===================================================================================

function addTag(event) {
    event.preventDefault()
    let value = event.currentTarget.tagInput.value
    
    let tagElement = document.createElement("span")
    tagElement.setAttribute("class", "tag")
    tagElement.innerHTML = value
    document.getElementById("tags-" + event.currentTarget.tagInput.getAttribute("data-student-id")).appendChild(tagElement)
    event.currentTarget.tagInput.value = ''
}

function filterResults(){
    let toFindName = document.getElementById("Namefilter").value.toLowerCase()
    let toFindTag = document.getElementById("Tagfilter").value.toLowerCase()

    let infos = document.getElementsByClassName("student-info-container")

    for(let i = 0; i < infos.length; i++) {
        let tags = document.querySelectorAll("#" + infos[i].id + " .tag")

        infos[i].style.display = 'none'

        let nameFiltering = false
        if(document.querySelector("#" + infos[i].id + " .name").innerHTML.toLowerCase().includes(toFindName)) {
            infos[i].style.display = 'flex'
            nameFiltering = true
        }

        let tagFiltering = false
        for(let j = 0; j < tags.length; j++){        
            if(tags[j].innerHTML.toLowerCase().includes(toFindTag)){
                infos[i].style.display= "flex"
                tagFiltering = true
            }
        }

        if (!nameFiltering || !tagFiltering) infos[i].style.display = 'none'
    }
}

// ===================================================================================
// ===================================================================================
