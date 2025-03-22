const canvas = document.getElementById('sorting-canvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generate-btn');
const sortBtn = document.getElementById('sort-btn');
const resetBtn = document.getElementById('reset-btn');
const algorithmSelect = document.getElementById('algorithm-select');
const sizeSlider = document.getElementById('size-slider');
const speedSlider = document.getElementById('speed-slider');
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');
const arrayDisplay = document.getElementById('array-content');

let array = [];
let speed = 100; // Sorting speed (ms) (fixed, max speed is now 1ms)
let arraySize = 100; // Initial array size

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Update UI with current array size and speed
sizeSlider.addEventListener('input', () => {
    arraySize = sizeSlider.value;
    sizeValue.textContent = arraySize;
});

speedSlider.addEventListener('input', () => {
    speed = 101 - speedSlider.value; // Fix reversed speed logic
    speedValue.textContent = speed;
});

// Generate a random array
function generateRandomArray() {
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * (canvas.height - 20)) + 5);
    }
    renderArray();
    displayArray();
}

// Render the array as simple bars
function renderArray() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / array.length;
    array.forEach((height, index) => {
        ctx.fillStyle = 'skyblue';
        ctx.fillRect(index * barWidth, canvas.height - height, barWidth, height);
    });
}

// Display array values on the screen
function displayArray() {
    arrayDisplay.textContent = array.join(', ');
}

// Sorting algorithms
async function bubbleSort() {
    let arr = [...array];
    const barWidth = canvas.width / arr.length;
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                renderSortingStep(arr, j, j + 1);
                await sleep(speed);
            }
        }
    }
    array = arr;
    renderArray();
    displayArray();
}

// Quick Sort Algorithm
async function quickSort(arr = array, left = 0, right = arr.length - 1) {
    if (left >= right) return;
    let pivotIndex = await partition(arr, left, right);
    await quickSort(arr, left, pivotIndex - 1);
    await quickSort(arr, pivotIndex + 1, right);
    renderArray();
    displayArray();
}

async function partition(arr, left, right) {
    let pivot = arr[right];
    let i = left - 1;
    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            renderSortingStep(arr, i, j);
            await sleep(speed);
        }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    renderSortingStep(arr, i + 1, right);
    await sleep(speed);
    return i + 1;
}

// Selection Sort Algorithm
async function selectionSort() {
    let arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            renderSortingStep(arr, i, minIdx);
            await sleep(speed);
        }
    }
    array = arr;
    renderArray();
    displayArray();
}

// Insertion Sort Algorithm
async function insertionSort() {
    let arr = [...array];
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            renderSortingStep(arr, j, j + 1);
            j--;
            await sleep(speed);
        }
        arr[j + 1] = key;
        renderSortingStep(arr, j + 1, i);
        await sleep(speed);
    }
    array = arr;
    renderArray();
    displayArray();
}

// Merge Sort Algorithm
async function mergeSort(arr = array) {
    if (arr.length <= 1) return arr;

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    const sortedLeft = await mergeSort(left);
    const sortedRight = await mergeSort(right);

    return merge(sortedLeft, sortedRight);
}

async function merge(left, right) {
    let result = [], leftIndex = 0, rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
        renderArrayWithHighlight(result, left, right);
        await sleep(speed);
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function renderArrayWithHighlight(result, left, right) {
    const barWidth = canvas.width / array.length;
    renderArray();
    ctx.fillStyle = 'orange';
    result.forEach((height, index) => {
        ctx.fillRect(index * barWidth, canvas.height - height, barWidth, height);
    });
    ctx.fillStyle = 'blue';
    left.forEach((height, index) => {
        ctx.fillRect(index * barWidth, canvas.height - height, barWidth, height);
    });
    ctx.fillStyle = 'green';
    right.forEach((height, index) => {
        ctx.fillRect(index * barWidth, canvas.height - height, barWidth, height);
    });
}

// Render step during sorting (highlight bars in red/green while sorting)
function renderSortingStep(arr, index1, index2) {
    const barWidth = canvas.width / arr.length;
    renderArray();
    ctx.fillStyle = 'red';
    ctx.fillRect(index1 * barWidth, canvas.height - arr[index1], barWidth, arr[index1]);
    ctx.fillStyle = 'green';
    ctx.fillRect(index2 * barWidth, canvas.height - arr[index2], barWidth, arr[index2]);
}

// Sleep function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize particles.js background animation
particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            }
        },
        "opacity": {
            "value": 0.5,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 3,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            }
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 100,
                "duration": 1
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

// Event Listeners
generateBtn.addEventListener('click', generateRandomArray);
sortBtn.addEventListener('click', () => {
    const selectedAlgorithm = algorithmSelect.value;
    if (selectedAlgorithm === 'bubble') {
        bubbleSort();
    } else if (selectedAlgorithm === 'quick') {
        quickSort();
    } else if (selectedAlgorithm === 'selection') {
        selectionSort();
    } else if (selectedAlgorithm === 'merge') {
        mergeSort();
    } else if (selectedAlgorithm === 'insertion') {
        insertionSort();
    }
});

resetBtn.addEventListener('click', () => {
    generateRandomArray();
});
