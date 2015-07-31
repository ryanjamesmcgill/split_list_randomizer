var randomJs = new RandomJs();




function generateRandomArray(callback, length, n_groups){
  /*
    generates random array from random.org API, will send array and requestsLeft to the callback
    function provided.
  */
  var arrRandom = []

    for(var i = 0; i<length-2; i++){
        requestRandint(i, length-1);    
    }

    function requestRandint(lower, upper){
        var output_num;
        var result= randomJs
          .apikey('00000000-0000-0000-0000-000000000000') // your apikey here
          .method('generateIntegers')
          .params({n:1,min: lower,max: upper})
          .post(handler);
    }

    function handler(xhrOrError, stream, body){
      if(body.hasOwnProperty('error')){
        console.log("error recieved from random.org:" + body.error.message);
        callback(true, body.error.message);
      } else{
        arrRandom.push(body.result.random.data[0]);
      }
      if(arrRandom.length >= length-2){
        callback(false, '', arrRandom, body.result.requestsLeft, length, n_groups);
      }
    }
}

function handler(error, error_msg, arrRandom, requestsLeft, length, n_groups){
  /*
    Event handler when random.org replies with required data
  */
  if(error){
    var error_element = '<div class="alert alert-danger" role="alert">'+error_msg+'</div>';
    $('.table-top').empty();
    $(error_element).appendTo('.table-top');
    disable_loading();
    return;
  }
  var slots = [], splits = [], newData = '', condition_val = 0;
  slots = shuffle_slots(arrRandom, requestsLeft, length, n_groups);
  splits = split(slots, n_groups);
  for (var i=0; i<splits.length; i++){
    condition_val = i+1;
    newData += '<tr><td>'+ condition_val + '</td><td>' + splits[i].toString().replace(/,/g,':') + '</td></tr>';
    console.log(splits[i]);
  }
  $('.tbl_data').empty();
  var header = '<thead><div><td class="condition">Condition</td><td>Wafers</td></div></thead>';
  $(header).appendTo('.tbl_data');
  $(newData).appendTo('.tbl_data');

  $('#available-requests').empty();
  $('<span>' + requestsLeft + '</span>').appendTo('#available-requests');

  disable_loading();

}

function shuffle_slots(arrRandom, requestsLeft, length, n_groups){
  /*
    shuffles slot list based on randomized array provided
  */
  var slots = [];
  for (var i = 0; i<length; i++){
    slots.push(i+1);
  }
  console.log('<== initialize ==>');
  console.log('slots:' + slots + ' length: ' + slots.length);
  console.log('arrRand:' + arrRandom + ' length: ' + arrRandom.length);
  console.log('requests left: ' + requestsLeft);

  for(var i=0; i<slots.length-2; i++){
    var rand_index = arrRandom[i];
    var temp = slots[i];
    slots[i] = slots[rand_index];
    slots[rand_index] = temp;
  }
  
  return slots;

}

function split(slots, n_groups) {
  /*
    splits array into n_groups
  */
    var len = slots.length, out = [], split = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n_groups--);
        split = slots.slice(i, i += size);
        split.sort(function(a, b){return a-b});
        out.push(split);
    }
    return out;
}

function generateSelection(n_groups){
  var i;
  for (i = 1; i<=25; i++){
      $('.groups').append('<option value="' + i + '">' + i + "</option>")
  }
}

$('.generate').click(function(){
    enable_loading();
    var n_groups = $('.groups').val();
    generateRandomArray(handler, 25, n_groups);
    //handler([9,6,8,22,8,12,23,23,13,18,14,14,19,23,21,15,20,23,19,19,23,23,24], -1, 25, n_groups);
});

function enable_loading(){
  $('.table-top').fadeOut("fast",function(){
      $('#loading-indicator').fadeIn("fast");
  });
}
function disable_loading(){
  $('#loading-indicator').fadeOut("fast", function(){
      $('.table-top').fadeIn("fast");
  });
}

generateSelection(25);



 