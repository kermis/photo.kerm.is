if (annyang) {
    // Let's define our first command. First the text we expect, and then the function it should call
    var commands = {
        '(take a )selfie': function() {
            console.log('selfie Time !!')
            takeAPicture();
        },
        '(take a )picture': function() {
            console.log('picture Time !!')
            takeAPicture();
        },
        '(say )cheese': function() {
            console.log('Cheese !!')
            takeAPicture();
        },
        'You make me happy': function() {
            console.log('Cheese !!')
            takeAPicture();
        },
        'go to :term': function(term){
          console.log('going to '+term+'.kerm.is')
          window.location = 'http://'+term+'.kerm.is';
        }
    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start();
}
