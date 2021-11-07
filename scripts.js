// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("upload-zone")
let root = document.getElementById("root")
let body = document.querySelector("body")
let picLoaded = false

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
  files = [...files]
  loadCanvas(files[0])
//   files.forEach(previewFile)
}

//https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image

var dataURL
var currentStep = 1
var canvas = new fabric.StaticCanvas('canvas')
let design = null
let design2 = null
let design3 = null

function stepChange(step) {
  root.classList.remove('current-step-1')
  root.classList.remove('current-step-2')
  root.classList.remove('current-step-3')
  body.classList.remove('current-step-1')
  body.classList.remove('current-step-2')
  body.classList.remove('current-step-3')
  root.classList.add('current-step-'+step)
  body.classList.add('current-step-'+step)
  currentStep = step
  if (step===1) {
    document.getElementById('fileElem').value = '';
    canvas.clear();
    dropArea.classList.remove('highlight')
  }
}

function loadCanvas(file) {
  if (!file) return

  dropArea.classList.add('loaded')
  stepChange(2)

  var reader = new FileReader()
 
  reader.onload = function (f) {
    if (picLoaded) return false
    picLoaded = true
    canvas.clear();
    var data = f.target.result;
    
    // Logo
    selectDesign(0)
  
    //Image
    fabric.Image.fromURL(data, function (img) {
      var oImg = img.set({
        left: 0,
        top: 0
      });
      if (oImg.width > oImg.height) {
        oImg.scaleToHeight(500);
      } else {
        oImg.scaleToWidth(500);
      }
      canvas
        .add(oImg)
        .centerObject(oImg)
        .sendToBack(oImg)
        .renderAll();
    });
  };
  reader.readAsDataURL(file);
}

document.getElementById('fileElem').addEventListener("change", function (e) {
  var file = e.target.files[0];
  loadCanvas(file);
});

document.getElementById('select-btn').addEventListener("click", function (e) {
  stepChange(3)
});

document.getElementById('back-btn-1').addEventListener("click", function (e) {
  picLoaded = false
  stepChange(1)
});

document.getElementById('back-btn-2').addEventListener("click", function (e) {
  stepChange(2)
});

document.getElementById('select-next-btn').addEventListener("click", function (e) {
  selectDesign(1)
});

document.getElementById('select-prev-btn').addEventListener("click", function (e) {
  selectDesign(-1)
});

document.getElementById('download-btn').addEventListener("click", function (e) {
  var dataURL = canvas.toDataURL({format: 'png', quality: 0.8});
  // this can be used to download any image from webpage to local disk
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function () {
    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response);
    a.download = 'image_name.png';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove()
  };
  xhr.open('GET', dataURL); // This is to download the canvas Image
  xhr.send();
});

let currentDesign = 1
const designCount = 5
var svg = '<svg xmlns="http://www.w3.org/2000/svg" height="500px" id="logo" preserveAspectRatio="xMidYMid meet" viewBox="0 0 480 480" width="480pt" ><path fill="#FF00AF" d="m2237 4794c-1-1-33-5-72-8-87-8-163-20-286-47l-95-21-74-227c-41-124-76-228-78-231-1-2-101 45-221 104l-218 109-44-27c-24-15-53-32-64-39s-22-15-25-18-27-20-54-39c-62-42-188-144-242-197l-42-39 404-202 404-203 1-47c0-26 2-67 4-92s6-107 10-184l7-139-134 7c-73 4-176 9-228 12-52 2-98 8-101 12-4 4-96 184-204 400-108 215-200 392-204 392s-21-17-38-37c-18-21-46-54-64-73-72-80-228-300-246-347-3-7 43-110 102-228 59-119 106-217 104-218-2-2-105-36-229-76s-226-75-228-76c-6-5-51-235-62-312-14-106-23-273-14-273 4 0 217 70 473 155s477 155 491 156c21 1 138-4 355-16 28-1 117-6 200-10 82-4 159-8 172-10 13-1 81-61 174-154l152-152-155-153c-84-84-160-153-168-153-33 0-338-15-380-18-25-2-118-6-206-10l-161-7-470 156c-259 86-473 156-477 156-7 0 0-177 9-232 2-13 6-43 9-68s8-54 10-65 12-60 21-110c10-49 22-95 27-102 5-6 107-44 226-83 119-40 220-75 225-79 4-4-40-101-98-215s-105-213-105-220c0-41 322-466 353-466 3 0 94 177 202 392 108 216 200 396 203 400 7 6 73 11 340 24l123 6-6-138c-4-77-9-164-10-194-2-30-4-72-4-92l-1-37-405-203-404-203 47-43c113-104 358-286 415-308 8-3 110 43 227 101 117 59 216 103 220 98 4-4 40-107 80-228s73-221 74-222c3-4 182-42 226-48 25-3 52-8 60-10 20-5 137-16 228-20 71-4 73-4 66 18-3 12-74 226-156 476-83 249-150 468-151 485 0 30 11 250 18 371 2 33 7 125 10 205 4 80 11 152 15 160 5 8 74 80 154 159l145 144v-989c0-544 0-1000 1-1013v-23l132 6c72 4 134 9 137 10 3 2 33 7 66 10 33 4 67 9 75 11s30 7 47 10c111 19 296 73 430 126 476 188 892 540 1159 979 117 193 226 445 270 625 21 89 43 190 50 230 4 28 9 57 11 65 22 106 22 619-1 658-2 4-6 30-10 57-13 105-60 291-106 420-248 693-818 1249-1513 1475-88 28-218 63-282 74-151 28-247 39-368 40l-99 1 1-1009v-1010l-153 153-153 152-2 57c-2 31-4 84-6 117s-6 123-10 200c-3 77-8 169-10 205-12 191-19 157 149 663 86 257 156 469 156 471 0 4-130 3-133 0zm940-699c41-19 77-35 80-35s17-8 31-19c15-10 50-31 77-46 133-73 352-262 466-401 319-390 468-863 426-1359-7-84-8-92-33-220-39-195-143-449-254-620-242-370-616-657-1012-775l-27-8v1782c0 981 2 1786 5 1788 7 8 150-44 241-87z" transform="matrix(.1 0 0 -.1 0 480)"/></svg>';
var svg2 = '<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><g style="mix-blend-mode:exclusion"><path d="M398.011 427.282C384.042 364.409 326.136 317.066 261.846 315.791C258.541 315.716 257.489 316.391 257.489 319.917C257.64 357.431 257.565 394.945 257.565 432.459C257.565 433.734 258.09 435.16 256.889 436.585C251.706 431.408 246.599 426.231 241.417 421.205C239.765 419.629 239.014 417.978 238.938 415.652C238.338 402.147 237.662 388.718 236.986 375.213C236.911 373.562 237.286 372.061 237.812 370.486C242.093 357.731 246.299 344.901 250.58 332.147C252.307 326.895 254.035 321.568 255.912 315.941C244.722 316.241 234.282 317.591 223.842 319.992C221.214 320.592 220.162 321.793 219.411 324.194C217.233 331.096 214.755 337.924 212.652 344.826C211.75 347.827 210.924 348.578 207.92 346.927C201.236 343.251 194.326 340.025 187.491 336.648C186.29 336.048 185.238 335.373 183.736 336.273C174.123 342.2 165.11 348.803 157.074 356.756C157.975 358.031 159.252 358.256 160.303 358.856C174.273 365.834 188.242 372.812 202.212 379.789C203.789 380.539 205.216 381.14 205.291 383.466C205.517 391.118 205.967 398.696 206.493 406.274C206.643 408.45 205.892 409.05 203.789 408.9C196.579 408.45 189.294 408.075 182.009 407.85C179.53 407.775 178.253 406.799 177.202 404.623C171.719 393.444 166.086 382.265 160.529 371.086C158.576 367.185 156.548 363.358 154.52 359.232C146.334 367.56 139.649 376.563 133.716 386.167C132.815 387.667 133.491 388.718 134.091 389.918C137.621 396.971 141.076 404.023 144.756 410.926C145.958 413.252 145.432 414.002 143.104 414.752C135.594 417.078 128.158 419.704 120.723 422.105C119.521 422.48 118.319 422.63 117.944 424.206C115.24 435.235 113.588 446.414 113.438 458.118C115.015 457.668 116.216 457.293 117.343 456.918C134.167 451.366 150.99 445.814 167.814 440.187C169.391 439.661 170.893 439.211 172.545 439.286C186.29 439.961 200.034 440.637 213.778 441.312C215.43 441.387 216.857 441.762 218.134 443.038C223.016 448.064 227.973 453.016 233.005 457.893C234.582 459.469 234.432 460.294 232.93 461.72C228.123 466.296 223.467 471.023 218.885 475.75C217.308 477.4 215.581 478.151 213.328 478.301C202.813 478.751 192.298 479.201 181.858 479.951C174.498 480.476 167.513 479.876 160.604 477.1C155.046 474.849 149.263 473.199 143.555 471.323C133.641 468.097 123.652 464.871 113.438 461.494C113.588 472.824 115.09 483.553 117.643 494.132C118.094 496.082 118.92 497.058 120.873 497.658C128.233 499.984 135.518 502.61 142.954 504.861C145.432 505.611 146.108 506.361 144.756 508.912C141.076 515.815 137.621 522.942 134.091 529.92C133.566 530.97 132.815 531.946 133.716 533.371C139.649 543.05 146.334 552.128 154.595 560.456C155.346 559.106 155.872 557.98 156.473 556.855C163.458 542.9 170.518 529.019 177.427 514.989C178.404 512.963 179.68 511.988 181.934 511.913C189.069 511.688 196.204 511.313 203.339 510.863C205.817 510.713 206.944 511.163 206.718 514.014C206.117 521.142 205.742 528.269 205.592 535.322C205.517 537.873 204.465 538.998 202.362 540.049C188.242 547.026 174.198 554.079 160.153 561.131C159.177 561.581 157.975 561.807 157.449 563.082C165.11 570.66 173.747 577.037 182.835 582.814C184.788 584.015 186.29 584.015 188.242 582.964C195.002 579.438 201.912 576.212 208.596 572.611C211.074 571.26 211.901 571.935 212.652 574.411C214.98 581.764 217.458 589.117 219.937 596.469C220.312 597.67 220.463 598.945 221.965 599.32C233.005 602.021 244.196 603.672 255.612 603.822C255.762 601.871 254.936 600.371 254.41 598.87C248.927 582.289 243.445 565.708 237.887 549.127C237.436 547.701 236.986 546.276 237.061 544.775C237.737 531.045 238.413 517.315 239.089 503.585C239.164 502.385 239.014 501.109 240.065 500.059C245.698 494.432 251.331 488.88 257.64 482.577C257.64 484.978 257.64 486.404 257.64 487.754C257.64 525.268 257.64 562.782 257.565 600.296C257.565 603.222 258.24 604.047 261.245 603.972C275.289 603.372 289.109 601.271 302.477 596.77C373.903 572.686 414.384 500.959 398.011 427.282ZM291.437 566.533C290.986 566.683 290.461 566.758 289.634 566.908C289.634 565.483 289.634 564.207 289.634 563.007C289.634 494.207 289.634 425.481 289.634 356.681C289.634 352.404 289.71 352.329 293.765 353.83C337.326 370.336 362.787 401.547 368.871 447.689C375.705 499.534 341.382 551.678 291.437 566.533Z" fill="#00F3FF"/><path d="M398.011 16.4556C384.042 -46.4176 326.136 -93.7602 261.846 -95.0356C258.541 -95.1107 257.489 -94.4354 257.489 -90.9091C257.64 -53.3952 257.565 -15.8813 257.565 21.6325C257.565 22.908 258.09 24.3335 256.889 25.7591C251.706 20.5822 246.599 15.4052 241.417 10.3784C239.765 8.8028 239.014 7.15218 238.938 4.82632C238.338 -8.67867 237.662 -22.1087 236.986 -35.6136C236.911 -37.2643 237.286 -38.7648 237.812 -40.3404C242.093 -53.0951 246.299 -65.9249 250.58 -78.6796C252.307 -83.9315 254.035 -89.2585 255.912 -94.8856C244.722 -94.5855 234.282 -93.235 223.842 -90.8341C221.214 -90.2339 220.162 -89.0334 219.411 -86.6325C217.233 -79.73 214.755 -72.9024 212.652 -65.9999C211.75 -62.9988 210.924 -62.2485 207.92 -63.8991C201.236 -67.5755 194.326 -70.8017 187.491 -74.1779C186.29 -74.7781 185.238 -75.4534 183.736 -74.553C174.123 -68.6259 165.11 -62.0234 157.074 -54.0705C157.975 -52.795 159.252 -52.5699 160.303 -51.9697C174.273 -44.9921 188.242 -38.0145 202.212 -31.0369C203.789 -30.2867 205.216 -29.6865 205.291 -27.3606C205.517 -19.7078 205.967 -12.13 206.493 -4.55215C206.643 -2.37635 205.892 -1.77613 203.789 -1.92619C196.579 -2.37635 189.294 -2.75149 182.009 -2.97657C179.53 -3.0516 178.253 -4.02695 177.202 -6.20277C171.719 -17.3819 166.086 -28.561 160.529 -39.7402C158.576 -43.6416 156.548 -47.468 154.52 -51.5946C146.334 -43.2665 139.649 -34.2631 133.716 -24.6596C132.815 -23.159 133.491 -22.1086 134.091 -20.9082C137.621 -13.8556 141.076 -6.80299 144.756 0.0995712C145.958 2.42543 145.432 3.1757 143.104 3.92599C135.594 6.25185 128.158 8.87782 120.723 11.2787C119.521 11.6538 118.319 11.8039 117.944 13.3795C115.24 24.4086 113.588 35.5877 113.438 47.292C115.015 46.8419 116.216 46.4667 117.343 46.0916C134.167 40.5395 150.99 34.9875 167.814 29.3604C169.391 28.8352 170.893 28.385 172.545 28.4601C186.29 29.1353 200.034 29.8106 213.778 30.4858C215.43 30.5608 216.857 30.936 218.134 32.2115C223.016 37.2383 227.973 42.1901 233.005 47.0669C234.582 48.6425 234.432 49.4678 232.93 50.8934C228.123 55.4701 223.467 60.1968 218.885 64.9236C217.308 66.5742 215.581 67.3244 213.328 67.4745C202.813 67.9247 192.298 68.3748 181.858 69.1251C174.498 69.6503 167.513 69.0501 160.604 66.2741C155.046 64.0232 149.263 62.3726 143.555 60.4969C133.641 57.2707 123.652 54.0445 113.438 50.6683C113.588 61.9975 115.09 72.7264 117.643 83.3054C118.094 85.2561 118.92 86.2314 120.873 86.8316C128.233 89.1575 135.518 91.7835 142.954 94.0343C145.432 94.7846 146.108 95.5349 144.756 98.0858C141.076 104.988 137.621 112.116 134.091 119.094C133.566 120.144 132.815 121.119 133.716 122.545C139.649 132.223 146.334 141.302 154.595 149.63C155.346 148.279 155.872 147.154 156.473 146.029C163.458 132.073 170.518 118.193 177.427 104.163C178.404 102.137 179.68 101.162 181.934 101.087C189.069 100.862 196.204 100.487 203.339 100.037C205.817 99.8865 206.944 100.337 206.718 103.188C206.117 110.315 205.742 117.443 205.592 124.496C205.517 127.047 204.465 128.172 202.362 129.222C188.242 136.2 174.198 143.253 160.153 150.305C159.177 150.755 157.975 150.98 157.449 152.256C165.11 159.834 173.747 166.211 182.835 171.988C184.788 173.189 186.29 173.189 188.242 172.138C195.002 168.612 201.912 165.386 208.596 161.784C211.074 160.434 211.901 161.109 212.652 163.585C214.98 170.938 217.458 178.29 219.937 185.643C220.312 186.844 220.463 188.119 221.965 188.494C233.005 191.195 244.196 192.846 255.612 192.996C255.762 191.045 254.936 189.545 254.41 188.044C248.927 171.463 243.445 154.882 237.887 138.301C237.436 136.875 236.986 135.45 237.061 133.949C237.737 120.219 238.413 106.489 239.089 92.7589C239.164 91.5584 239.014 90.2829 240.065 89.2326C245.698 83.6055 251.331 78.0534 257.64 71.7511C257.64 74.152 257.64 75.5775 257.64 76.928C257.64 114.442 257.64 151.956 257.565 189.47C257.565 192.396 258.24 193.221 261.245 193.146C275.289 192.546 289.109 190.445 302.477 185.943C373.903 161.859 414.384 90.1329 398.011 16.4556ZM291.437 155.707C290.986 155.857 290.461 155.932 289.634 156.082C289.634 154.657 289.634 153.381 289.634 152.181C289.634 83.3804 289.634 14.655 289.634 -54.1455C289.634 -58.4221 289.71 -58.4971 293.765 -56.9966C337.326 -40.4904 362.787 -9.27889 368.871 36.8632C375.705 88.7074 341.382 140.852 291.437 155.707Z" fill="#00F3FF"/><path d="M631.017 231.066C617.047 168.193 559.141 120.851 494.851 119.575C491.546 119.5 490.495 120.175 490.495 123.702C490.645 161.216 490.57 198.729 490.57 236.243C490.57 237.519 491.096 238.944 489.894 240.37C484.712 235.193 479.605 230.016 474.422 224.989C472.77 223.414 472.019 221.763 471.944 219.437C471.343 205.932 470.667 192.502 469.991 178.997C469.916 177.347 470.291 175.846 470.817 174.27C475.098 161.516 479.304 148.686 483.585 135.931C485.313 130.679 487.04 125.352 488.918 119.725C477.727 120.025 467.287 121.376 456.848 123.777C454.219 124.377 453.167 125.577 452.416 127.978C450.238 134.881 447.76 141.708 445.657 148.611C444.756 151.612 443.93 152.362 440.925 150.712C434.241 147.035 427.331 143.809 420.497 140.433C419.295 139.833 418.244 139.157 416.741 140.058C407.128 145.985 398.115 152.587 390.079 160.54C390.98 161.816 392.257 162.041 393.309 162.641C407.278 169.619 421.248 176.596 435.217 183.574C436.795 184.324 438.222 184.924 438.297 187.25C438.522 194.903 438.973 202.481 439.498 210.059C439.649 212.234 438.897 212.835 436.795 212.685C429.584 212.234 422.299 211.859 415.014 211.634C412.536 211.559 411.259 210.584 410.207 208.408C404.725 197.229 399.092 186.05 393.534 174.871C391.581 170.969 389.553 167.143 387.525 163.016C379.339 171.344 372.655 180.348 366.721 189.951C365.82 191.452 366.496 192.502 367.097 193.703C370.627 200.755 374.082 207.808 377.762 214.71C378.963 217.036 378.438 217.787 376.109 218.537C368.599 220.863 361.164 223.489 353.728 225.89C352.526 226.265 351.325 226.415 350.949 227.99C348.245 239.019 346.593 250.199 346.443 261.903C348.02 261.453 349.222 261.078 350.348 260.702C367.172 255.15 383.996 249.598 400.819 243.971C402.396 243.446 403.898 242.996 405.551 243.071C419.295 243.746 433.039 244.421 446.784 245.097C448.436 245.172 449.863 245.547 451.14 246.822C456.021 251.849 460.978 256.801 466.01 261.678C467.588 263.253 467.437 264.079 465.935 265.504C461.129 270.081 456.472 274.808 451.891 279.534C450.313 281.185 448.586 281.935 446.333 282.085C435.818 282.536 425.303 282.986 414.864 283.736C407.503 284.261 400.519 283.661 393.609 280.885C388.051 278.634 382.268 276.983 376.56 275.108C366.646 271.882 356.657 268.655 346.443 265.279C346.593 276.608 348.095 287.337 350.649 297.916C351.099 299.867 351.926 300.842 353.878 301.442C361.239 303.768 368.524 306.394 375.959 308.645C378.438 309.395 379.114 310.146 377.762 312.697C374.082 319.599 370.627 326.727 367.097 333.704C366.571 334.755 365.82 335.73 366.721 337.156C372.655 346.834 379.339 355.913 387.601 364.241C388.352 362.89 388.877 361.765 389.478 360.639C396.463 346.684 403.523 332.804 410.433 318.774C411.409 316.748 412.686 315.773 414.939 315.698C422.074 315.473 429.209 315.098 436.344 314.647C438.822 314.497 439.949 314.947 439.724 317.799C439.123 324.926 438.747 332.054 438.597 339.106C438.522 341.657 437.47 342.783 435.368 343.833C421.248 350.811 407.203 357.863 393.158 364.916C392.182 365.366 390.98 365.591 390.455 366.867C398.115 374.445 406.752 380.822 415.84 386.599C417.793 387.799 419.295 387.799 421.248 386.749C428.007 383.223 434.917 379.997 441.601 376.395C444.08 375.045 444.906 375.72 445.657 378.196C447.985 385.549 450.464 392.901 452.942 400.254C453.318 401.454 453.468 402.73 454.97 403.105C466.01 405.806 477.201 407.457 488.617 407.607C488.767 405.656 487.941 404.155 487.415 402.655C481.933 386.074 476.45 369.493 470.892 352.912C470.442 351.486 469.991 350.06 470.066 348.56C470.742 334.83 471.418 321.1 472.094 307.37C472.169 306.169 472.019 304.894 473.07 303.843C478.703 298.216 484.336 292.664 490.645 286.362C490.645 288.763 490.645 290.188 490.645 291.539C490.645 329.053 490.645 366.567 490.57 404.08C490.57 407.007 491.246 407.832 494.25 407.757C508.295 407.157 522.114 405.056 535.483 400.554C606.908 376.47 647.39 304.744 631.017 231.066ZM524.442 370.318C523.992 370.468 523.466 370.543 522.64 370.693C522.64 369.268 522.64 367.992 522.64 366.792C522.64 297.991 522.64 229.266 522.64 160.465C522.64 156.189 522.715 156.114 526.771 157.614C570.332 174.12 595.792 205.332 601.876 251.474C608.711 303.318 574.387 355.462 524.442 370.318Z" fill="#00F3FF"/><path d="M158.873 231.066C144.904 168.193 86.9975 120.851 22.7074 119.575C19.4027 119.5 18.3512 120.175 18.3512 123.702C18.5014 161.216 18.4263 198.729 18.4263 236.243C18.4263 237.519 18.9521 238.944 17.7504 240.37C12.5681 235.193 7.46097 230.016 2.27871 224.989C0.626389 223.414 -0.124649 221.763 -0.19976 219.437C-0.800598 205.932 -1.47655 192.502 -2.1525 178.997C-2.2276 177.347 -1.85207 175.846 -1.32633 174.27C2.95467 161.516 7.16057 148.686 11.4416 135.931C13.169 130.679 14.8964 125.352 16.774 119.725C5.58334 120.025 -4.85629 121.376 -15.2959 123.777C-17.9246 124.377 -18.9761 125.577 -19.7271 127.978C-21.9052 134.881 -24.3837 141.708 -26.4866 148.611C-27.3879 151.612 -28.214 152.362 -31.2182 150.712C-37.9026 147.035 -44.8123 143.809 -51.6469 140.433C-52.8486 139.833 -53.9 139.157 -55.4021 140.058C-65.0156 145.985 -74.0283 152.587 -82.0645 160.54C-81.1633 161.816 -79.8865 162.041 -78.835 162.641C-64.8654 169.619 -50.8958 176.596 -36.9262 183.574C-35.349 184.324 -33.922 184.924 -33.8469 187.25C-33.6216 194.903 -33.171 202.481 -32.6452 210.059C-32.495 212.234 -33.2461 212.835 -35.349 212.685C-42.5591 212.234 -49.8444 211.859 -57.1296 211.634C-59.608 211.559 -60.8848 210.584 -61.9363 208.408C-67.419 197.229 -73.0519 186.05 -78.6097 174.871C-80.5624 170.969 -82.5903 167.143 -84.6181 163.016C-92.8046 171.344 -99.4889 180.348 -105.422 189.951C-106.324 191.452 -105.648 192.502 -105.047 193.703C-101.517 200.755 -98.0619 207.808 -94.3818 214.71C-93.1801 217.036 -93.7058 217.787 -96.0341 218.537C-103.545 220.863 -110.98 223.489 -118.415 225.89C-119.617 226.265 -120.819 226.415 -121.194 227.99C-123.898 239.019 -125.55 250.199 -125.701 261.903C-124.123 261.453 -122.922 261.078 -121.795 260.702C-104.972 255.15 -88.148 249.598 -71.3245 243.971C-69.7472 243.446 -68.2451 242.996 -66.5928 243.071C-52.8486 243.746 -39.1043 244.421 -25.36 245.097C-23.7077 245.172 -22.2807 245.547 -21.0039 246.822C-16.1221 251.849 -11.1651 256.801 -6.13308 261.678C-4.55587 263.253 -4.70607 264.079 -6.20818 265.504C-11.0149 270.081 -15.6715 274.808 -20.2529 279.534C-21.8301 281.185 -23.5575 281.935 -25.8107 282.085C-36.3254 282.536 -46.8401 282.986 -57.2798 283.736C-64.6401 284.261 -71.6249 283.661 -78.5346 280.885C-84.0924 278.634 -89.8755 276.983 -95.5835 275.108C-105.497 271.882 -115.486 268.655 -125.701 265.279C-125.55 276.608 -124.048 287.337 -121.495 297.916C-121.044 299.867 -120.218 300.842 -118.265 301.442C-110.905 303.768 -103.62 306.394 -96.1843 308.645C-93.7058 309.395 -93.0299 310.146 -94.3818 312.697C-98.0619 319.599 -101.517 326.727 -105.047 333.704C-105.572 334.755 -106.324 335.73 -105.422 337.156C-99.4889 346.834 -92.8046 355.913 -84.543 364.241C-83.7919 362.89 -83.2662 361.765 -82.6654 360.639C-75.6806 346.684 -68.6207 332.804 -61.711 318.774C-60.7346 316.748 -59.4578 315.773 -57.2047 315.698C-50.0697 315.473 -42.9347 315.098 -35.7997 314.647C-33.3212 314.497 -32.1946 314.947 -32.4199 317.799C-33.0208 324.926 -33.3963 332.054 -33.5465 339.106C-33.6216 341.657 -34.6731 342.783 -36.776 343.833C-50.8958 350.811 -64.9405 357.863 -78.9852 364.916C-79.9616 365.366 -81.1633 365.591 -81.689 366.867C-74.0283 374.445 -65.3911 380.822 -56.3034 386.599C-54.3507 387.799 -52.8486 387.799 -50.8958 386.749C-44.1364 383.223 -37.2267 379.997 -30.5423 376.395C-28.0638 375.045 -27.2377 375.72 -26.4866 378.196C-24.1583 385.549 -21.6799 392.901 -19.2014 400.254C-18.8259 401.454 -18.6757 402.73 -17.1736 403.105C-6.13308 405.806 5.05762 407.457 16.4736 407.607C16.6238 405.656 15.7977 404.155 15.2719 402.655C9.78925 386.074 4.30655 369.493 -1.25124 352.912C-1.70187 351.486 -2.1525 350.06 -2.07738 348.56C-1.40144 334.83 -0.725494 321.1 -0.0495453 307.37C0.0255585 306.169 -0.124649 304.894 0.926819 303.843C6.55972 298.216 12.1926 292.664 18.5014 286.362C18.5014 288.763 18.5014 290.188 18.5014 291.539C18.5014 329.053 18.5014 366.567 18.4263 404.08C18.4263 407.007 19.1023 407.832 22.1065 407.757C36.1512 407.157 49.9706 405.056 63.3393 400.554C134.764 376.47 175.246 304.744 158.873 231.066ZM52.2988 370.318C51.8482 370.468 51.3225 370.543 50.4963 370.693C50.4963 369.268 50.4963 367.992 50.4963 366.792C50.4963 297.991 50.4963 229.266 50.4963 160.465C50.4963 156.189 50.5714 156.114 54.6271 157.614C98.1882 174.12 123.649 205.332 129.732 251.474C136.567 303.318 102.244 355.462 52.2988 370.318Z" fill="#00F3FF"/></g></svg>';

let designTitles = [
  'L21-15-01',
  'L21-15-02',
  'L21-15-03',
  'L21-15-04',
  'L21-15-05'
]

const designNoEl = document.getElementById("current-design-no");
designNoEl.innerHTML = currentDesign
const designCountEl = document.getElementById("design-count");
designCountEl.innerHTML = designCount
const designTitleEl = document.getElementById("design-title");
designTitleEl.innerHTML = designTitles[currentDesign-1]

function selectDesign(d) {
  currentDesign = currentDesign + d
  if (currentDesign === 0) currentDesign = designCount
  else if (currentDesign > designCount) currentDesign = 1

  if (design) canvas.remove(design);
  // if (design2) canvas.remove(design2);

  designNoEl.innerHTML = currentDesign
  designTitleEl.innerHTML = designTitles[currentDesign-1]

  if (currentDesign === 1) {
    overlayImg = "./assets/L21-15-01.svg";
    fabric.Image.fromURL(overlayImg, function (img) {
      design = img.set({
        left: 0,
        top: 0
      });
      if (design.width > design.height) {
        design.scaleToHeight(500);
      } else {
        design.scaleToWidth(500);
      }
      design.globalCompositeOperation = 'screen';
      canvas.add(design);
    });
  }
  else if (currentDesign === 2) {
    overlayImg = "./assets/L21-15-02.svg";
    fabric.Image.fromURL(overlayImg, function (img) {
      design = img.set({
        left: 0,
        top: 0
      });
      if (design.width > design.height) {
        design.scaleToHeight(500);
      } else {
        design.scaleToWidth(500);
      }
      design.globalCompositeOperation = 'screen';
      canvas.add(design);
    });
  }
  else if (currentDesign === 3) {
    overlayImg = "./assets/L21-15-03.svg";
    fabric.Image.fromURL(overlayImg, function (img) {
      design = img.set({
        left: 0,
        top: 0
      });
      if (design.width > design.height) {
        design.scaleToHeight(500);
      } else {
        design.scaleToWidth(500);
      }
      design.globalCompositeOperation = 'screen';
      canvas.add(design);
    });
  }
  else if (currentDesign === 4) {
    overlayImg = "./assets/L21-15-04.svg";
    fabric.Image.fromURL(overlayImg, function (img) {
      design = img.set({
        left: 0,
        top: 0
      });
      if (design.width > design.height) {
        design.scaleToHeight(500);
      } else {
        design.scaleToWidth(500);
      }
      design.globalCompositeOperation = 'screen';
      canvas.add(design);
    });
  }
  else if (currentDesign === 5) {
    overlayImg = "./assets/L21-15-05.svg";
    fabric.Image.fromURL(overlayImg, function (img) {
      design = img.set({
        left: 0,
        top: 0
      });
      if (design.width > design.height) {
        design.scaleToHeight(500);
      } else {
        design.scaleToWidth(500);
      }
      design.globalCompositeOperation = 'screen';
      canvas.add(design);
    });
  }
}