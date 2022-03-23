/* Class Declaration */
class WeddingDataClassForBackend {
    constructor(imageList, textList, arrayTextList, correctionDone, fileName) {
        this.imageList = imageList;
        this.textList = textList;
        this.arrayTextList = arrayTextList;
        this.correctionDone = correctionDone;
        this.fileName = fileName;
    }
    getImageList() {
        return this.imageList;
    }
    getTextList() {
        return this.textList;
    }
    getArrayTextList() {
        return this.arrayTextList;
    }
    isCorrectDone() {
        return this.correctionDone;
    }
    getFileName() {
        return this.fileName;
    }
    setImageList(imageList) {
        this.imageList = imageList;
    }
    setTextList(textList) {
        this.textList = textList;
    }
    setArrayTextList(arrayTextList) {
        this.arrayTextList = arrayTextList;
    }
    setCorrectDone(correctionDone) {
        this.correctionDone = correctionDone;
    }
    setFileName(fileName) {
        this.fileName = fileName;
    }
}