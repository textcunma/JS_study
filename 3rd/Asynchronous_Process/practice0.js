function first() {
    console.log(1)
}

function second() {
    console.log(2)
}

function third() {
    console.log(3)
}

first()
second()
third()

function first2() {
    console.log(1)
}

function second2() {
    setTimeout(() => {
        console.log(2)
    }, 0)
}

function third2() {
    console.log(3)
}

first2()
second2()
third2()