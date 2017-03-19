---
layout: posts
title: 排序方法总结 (续上篇)
tags: algoritm javascript
category: javascript
excerpt: 继上次的排序算法，实现了快速排序，堆排序等算法
date: 22:25 2017-3-15
---

# 排序算法总结

## 四、快速排序

快速排序在各个面试中经常容易考到，基本思想是通过一趟排序之后，数组的一部分总是必另一部分小。然后对两部分分别进行快速排序，整个过程可以递归进行。

具体来说就是在待排序的数组中取一个参考值(通常是第一个数值)，将数组分成两部分，比参考值小的数值在数组的前半部分，比参考值大的数值在数组的后半部分。并且把该参考值放在中间。递归进行此部分直到整个数组排序为止。

时间复杂度： O(n^2)

具体代码如下：

```
function fastSort(arr, begin, end) {
    let i = begin;
    let j = end;
    if(begin < end) {
        let temp = arr[begin];
        while(i != j) {
            while(j > i && arr[j] > temp) {
                j --;
            }
            if(j > i) {
                arr[i] = arr[j];
                i ++;
            }
            while(i < j && arr[i] < temp) {
                i ++;
            }
            if(i < j) {
                arr[j] = arr[i];
                j --;
            }
        }

        arr[i] = temp;
        fastSort(arr, begin, i - 1);
        fastSort(arr, i + 1, end);
    }
}
```

## 五、归并排序

归并排序（MERGE-SORT）是建立在归并操作上的一种有效的排序算法。该算法是采用分治法的一个典型应用。将原序列分成若干个子序列，将子序列排序后再合并。这个过程就是归并排序。

时间复杂度： O(n^2)

具体代码如下：

```
function merge(arr, tempArr, start, middle, end) {
    let i = start;
    let j = middle + 1;
    let k = start;
    while(i < middle + 1 && j < end + 1) {
        if(arr[i] > arr[j]) {
            tempArr[k ++] = arr[j ++];
        } else {
            tempArr[k ++] = arr[i ++];
        }
    }
    while(i != middle + 1)
        tempArr[k ++] = arr[i ++];
    while(j != end + 1)
        tempArr[k ++] = arr[j ++];
    for(i = start; i <= end; i++)
        arr[i] = tempArr[i];
}

function mergeSort(arr, tempArr, start, end) {
    int mid;
    if(start < end) {
        mid = (start + end) / 2;
        mergeSort(arr, tempArr, start, mid);
        mergeSort(arr, tempArr, mid + 1, end);
        merge(sourceArr, tempArr, start, mid, end);
    }
}
```