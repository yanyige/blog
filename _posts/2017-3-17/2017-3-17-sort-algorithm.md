---
layout: posts
title: 排序算法(cavans,可视化)
tags: canvas algoritm javascript
category: javascript
excerpt: 使用canvas实现的图形化显示各种排序的排序方式~
date: 22:25 2017-3-17
---

<span>插入排序</span>
<input type="text" id="insertSortLength" name="arrayLength" placeholder="数组长度，默认20">
<button style="display: inline-block" id="insertSort_button">生成数组</button>
<button style="display: inline-block" id="insertSort_start">开始排序</button>
<canvas style="display: block;" id="insertSort" width="800" height="600"></canvas>

<span>希尔排序</span>
<input type="text" id="shellSortLength" name="shellArrayLength" placeholder="数组长度，默认20">
<button style="display: inline-block" id="shellSort_button">生成数组</button>
<button style="display: inline-block" id="shellSort_start">开始排序</button>
<canvas style="display: block;" id="shellSort" width="800" height="600"></canvas>

<span>冒泡</span>
<input type="text" id="bubbleSortLength" name="bubbleArrayLength" placeholder="数组长度，默认20">
<button style="display: inline-block" id="bubbleSort_button">生成数组</button>
<button style="display: inline-block" id="bubbleSort_start">开始排序</button>
<canvas style="display: block;" id="bubbleSort" width="800" height="600"></canvas>

<script type="text/javascript">

    var insertArr = [];
    var insertCanvas = document.getElementById('insertSort');
    var insertContext = insertCanvas.getContext('2d');

    var shellArr = [];
    var shellCanvas = document.getElementById('shellSort');
    var shellContext = shellCanvas.getContext('2d');

    var bubbleArr = [];
    var bubbleCanvas = document.getElementById('bubbleSort');
    var bubbleContext = bubbleCanvas.getContext('2d');

    function init(canvas, context, arr) {
        _arr = MakeArr(20);
        for(let i = 0; i < _arr.length; i ++) {
            arr[i] = _arr[i];
        }
        //***************insert init****************//
        context.strokeStyle = 'rgb(0, 0, 0)',context.fillStyle = 'rgb(0, 0, 0)',
        context.strokeWidth = 1;

        context.moveTo(0, 0);
        context.lineTo(0, canvas.height);
        context.lineTo(canvas.width, canvas.height);

        context.stroke();
        drawArray(canvas, context, arr);
        //***************insert init****************//
    }

    init(insertCanvas, insertContext, insertArr);
    init(shellCanvas, shellContext, shellArr);
    init(bubbleCanvas, bubbleContext, bubbleArr);

    function bindEvent(name, arr, canvas, context) {
        // console.log(arr);
        var arrayButton = document.getElementById(name + '_button');
        var sortButton = document.getElementById(name + '_start');
        arrayButton.onclick = function() {
            var _length = document.getElementById(name+"Length").value || 20;

            arr = MakeArr(_length);

            drawArray(canvas, context, arr);
        };
        sortButton.onclick = function() {
            console.log(name + '(canvas, context, arr)');
            eval(name + '(canvas, context, arr)');
        }
    }
    bindEvent('insertSort', insertArr, insertCanvas, insertContext);
    bindEvent('shellSort', shellArr, shellCanvas, shellContext);
    bindEvent('bubbleSort', bubbleArr, bubbleCanvas, bubbleContext);

    function insertSort(canvas, context, arr) {

        var length = arr.length;
        for(let i = 1; i < length; i ++) {
            let temp = arr[i];
            let j = i - 1;
            while(j >= 0 && temp < arr[j]) {
                arr[j + 1] = arr[j];
                j --;
            }
            arr[j + 1] = temp;
            let _arr = CopyArr(arr);
            setTimeout(function() {
                drawArray(canvas, context, _arr, i);
            }, 500 * i);
        }
        return arr;
    }

    function shellSort(canvas, context, arr) {
        let length = arr.length;
        let d = length >> 1;
        let times = 0;

        while(d > 0) {
            times ++;
            for(let i = d; i < length; i ++) {
                let j = i - d;
                while(j >= 0 && arr[j] > arr[j + d]) {
                    let temp = arr[j];
                    arr[j] = arr[j + d];
                    arr[j + d] = temp;
                    j = j - d;
                    let _arr = CopyArr(arr);
                }
            }
            let _arr = CopyArr(arr);
            setTimeout(function() {
                drawArray(canvas, context, _arr);
            }, 1000 * times);
            d = d >> 1;

        }
        return arr;
    }

    function bubbleSort(canvas, context, arr) {
        let length = arr.length;
        let times = 0;
        // console.log(arr);
        for(let i = 0; i < length - 1; i ++) {
            for(let j = length - 1; j > i; j --) {
                if(arr[j] < arr[j - 1]) {
                    let temp = arr[j];
                    arr[j] = arr[j - 1];
                    arr[j - 1] = temp;

                }
                times ++;
                let _arr = CopyArr(arr);
                setTimeout(function() {
                    drawArray(canvas, context, _arr, i - 1, j - 1);
                }, 500 * times);

            }
        }
        // console.log(arr);
        return arr;
    }

    // context.fillRect(20, 120, 100, 100);

    function drawArray(canvas, context, arr, id, id1) {
        // console.log(context);
        context.clearRect(1, 0, canvas.width, canvas.height - 1);

        let arrLength = arr.length;

        let visibleW = canvas.width * .9;

        let _width = 2 * visibleW / (3 * arrLength - 1);

        let _blank = _width / 2;

        let maxnum = Math.max.apply(null, arr);

        let visibleH = canvas.height * .9;

        let x = canvas.width * .05;

        for(let i = 0; i < arrLength; i ++) {
            if(id == i) {
                context.fillStyle = 'rgb(255, 0, 0)';
            } else if(i == id1) {
                context.fillStyle = 'green';
            }else {
                context.fillStyle = 'rgb(0, 0, 0)';
            }
            drawBar(context, x, canvas.height, _width, arr[i] * visibleH / maxnum);
            x += (_blank + _width);

        }
    }
    function drawBar(context, sx, sy, width, height) {
        context.fillRect(sx, sy - height, width, height);
    }

    function CopyArr(arr) {
        let _arr = new Array();
        let length = arr.length;
        for(let i = 0; i < length; i ++) {
            _arr[i] = arr[i];
        }
        return _arr;
    }

    function MakeArr(length) {
        var _arr = [];
        for(let i = 0; i < length; i ++) {
            _arr[i] = i + 1;
        }
        for(let i = 0; i < length; i ++) {
            let temp = parseInt(Math.random() * length);
            let _temp = _arr[temp];
            _arr[temp] = _arr[i];
            _arr[i] = _temp;
        }

        return _arr;
    }


</script>