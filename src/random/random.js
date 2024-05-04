"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightedRandom = exports.rollDiceDropLowest = exports.randomIndicesNoReplacement = exports.shuffle = exports.randFromBounds = exports.randRange = void 0;
/**
 * Returns a random integer in the inclusive integer range [lo, hi].
 *
 * @param {number} lo
 * @param {number} hi
 * @returns {number}
 */
function randRange(lo, hi) {
    return Math.floor(lo + Math.random() * (hi - lo + 1));
}
exports.randRange = randRange;
/**
 * Given a two-element array `bounds` of two numbers defining an inclusive
 * integer range, return a random element inside that range.
 *
 * @param {Array} bounds
 * @returns {number}
 */
function randFromBounds(bounds) {
    return randRange(bounds[0], bounds[1]);
}
exports.randFromBounds = randFromBounds;
/**
 * Shuffles the given array in-place using the Fisher-Yates algorithm.
 *
 * @param {Array} arr
 */
function shuffle(arr) {
    // Fisher-Yates shuffle
    for (var i = 0; i < arr.length - 1; i++) {
        var j = Math.floor(i + Math.random() * (arr.length - i));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}
exports.shuffle = shuffle;
/**
 * Gets a random set of numbers of size k in the range 0, 1, ... n-1. Returns
 * null if k > n.
 *
 * @param {number} n
 * @param {number} k
 * @returns {Array<number> | null}
 */
function randomIndicesNoReplacement(n, k) {
    if (n < k) {
        return null;
    }
    var arr = Array.from({ length: n }, function (_, i) { return i; });
    for (var i = 0; i < Math.min(k, n - 1); i++) {
        var j = Math.floor(i + Math.random() * (arr.length - i));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr.slice(0, k);
}
exports.randomIndicesNoReplacement = randomIndicesNoReplacement;
/**
 * Rolls n d-sided dice, takes the highest k, and sums them together.
 *
 * @param {number} d - Number of sides on each die.
 * @param {number} n - Number of dice.
 * @param {number} k - Number of dice we are summing together.
 * @returns {number}
 */
function rollDiceDropLowest(d, n, k) {
    var dice = Array.from({ length: n }, function (_, _i) { return randRange(1, d); });
    dice.sort(function (a, b) { return a - b; });
    var topK = dice.slice(n - k, n);
    return topK.reduce(function (a, b) { return a + b; }, 0);
}
exports.rollDiceDropLowest = rollDiceDropLowest;
function weightedRandom(objects) {
    var buckets = Array(objects.length + 1).fill(0);
    for (var i = 0; i < objects.length; i++) {
        buckets[i + 1] = objects[i].weight + buckets[i];
    }
    var value = Math.random() * buckets[objects.length];
    for (var i = 0; i < objects.length; i++) {
        if (buckets[i] <= value && buckets[i + 1] > value) {
            return objects[i].value;
        }
    }
    return objects[0].value;
}
exports.weightedRandom = weightedRandom;
