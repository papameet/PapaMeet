function onSubmit(){
    let joinTime = document.getElementById('join').value
    let leaveTime = document.getElementById('leave').value
    console.log([joinTime,leaveTime])
}

const submit = document.getElementsByClassName('submit')
submit[0].addEventListener('click', ()=>onSubmit())

let elems = document.querySelectorAll('.timepicker');
let instances = M.Timepicker.init(elems);

console.log('hi')