const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

export { canvas, ctx };