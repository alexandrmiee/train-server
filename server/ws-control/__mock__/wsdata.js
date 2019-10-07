const testData = {
  module:'test',
  data:{
    action: 'test',
    train:{
      pointer:'pointer',
      route: 1,
      capacity: 1,
    },
    box: 0,
  }
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = function* (start=0, isRand=true) {
  let index = start;
  while(true){
    yield isRand? 
    { 
      module: testData.module+getRandomInt(10),
      data:{
        action: testData.data.action+getRandomInt(10),
        train:{
          pointer: testData.data.train.pointer+getRandomInt(10),
          route: 1,
          capacity: 1,
        },
        box: 0,
      }
    }
    : {...testData}
  }
}