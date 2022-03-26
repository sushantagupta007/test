// Script written by aman !
function resolve(value) {
   return value;
}

async function getData(path) {
   // weddingcard2/allcard/cards/Dj9mMD0D5wprjxkSpTNP
   let a = await db.doc(path).get()
   return resolve(a);
}




