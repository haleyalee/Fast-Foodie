const gameState = {
    score: 0,
    starRating: 5,
    currentWaveCount: 1,
    customerIsReady: false,
    cam: {},
    gameSpeed: 3,
    currentMusic: {},
    totalWaveCount: 3,
    countdownTimer: 15,
    readyForNextOrder: true,
    customersServedCount: 0
  }
  
  // Gameplay scene
  class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' })
    }
  
    updateCustomerCountText() {
      gameState.customersLeftCount = gameState.totalCustomerCount - gameState.customersServedCount;
  
      gameState.customerCountText.setText(`Customers left: ${gameState.customersLeftCount}`);  
    }
  
    preload() {
      // Preload images
      const baseURL = 'https://codecademy-content.s3.amazonaws.com/courses/learn-phaser/fastfoodie/';
      this.load.image('Chef', `${baseURL}art/Chef.png`);
      this.load.image('Customer-1', `${baseURL}art/Customer-1.png`);
      this.load.image('Customer-2', `${baseURL}art/Customer-2.png`);
      this.load.image('Customer-3', `${baseURL}art/Customer-3.png`);
      this.load.image('Customer-4', `${baseURL}art/Customer-4.png`);
      this.load.image('Customer-5', `${baseURL}art/Customer-5.png`);
      this.load.image('Floor-Server', `${baseURL}art/Floor-Server.png`);
      this.load.image('Floor-Customer', `${baseURL}art/Floor-Customer.png`);
      this.load.image('Tray', `${baseURL}art/Tray.png`);
      this.load.image('Barrier', `${baseURL}art/Barrier.png`);
      this.load.image('Star-full', `${baseURL}art/Star-full.png`);
      this.load.image('Star-half', `${baseURL}art/Star-half.png`);
      this.load.image('Star-empty', `${baseURL}art/Star-empty.png`);
  
      // Preload song
      this.load.audio('gameplayTheme', [
        `${baseURL}audio/music/2-gameplayTheme.ogg`,
        `${baseURL}audio/music/2-gameplayTheme.mp3`
      ]); // Credit: "Pixel Song #18" by hmmm101: https://freesound.org/people/hmmm101
  
      // Preload SFX
      this.load.audio('placeFoodSFX', [
        `${baseURL}audio/sfx/placeFood.ogg`,
        `${baseURL}audio/sfx/placeFood.mp3`
      ]); // Credit: "action_02.wav" by dermotte: https://freesound.org/people/dermotte
  
      this.load.audio('servingCorrectSFX', [
        `${baseURL}audio/sfx/servingCorrect.ogg`,
        `${baseURL}audio/sfx/servingCorrect.mp3`
      ]); // Credit: "Video Game SFX Positive Action Long Tail" by rhodesmas: https://freesound.org/people/djlprojects
  
      this.load.audio('servingIncorrectSFX', [
        `${baseURL}audio/sfx/servingIncorrect.ogg`,
        `${baseURL}audio/sfx/servingIncorrect.mp3`
      ]); // Credit: "Incorrect 01" by rhodesmas: https://freesound.org/people/rhodesmas
  
      this.load.audio('servingEmptySFX', [
        `${baseURL}audio/sfx/servingEmpty.ogg`,
        `${baseURL}audio/sfx/servingEmpty.mp3`
      ]); // Credit: "Computer Error Noise [variants of KevinVG207's Freesound#331912].wav" by Timbre: https://freesound.org/people/Timbre
  
      this.load.audio('fiveStarsSFX', [
        `${baseURL}audio/sfx/fiveStars.ogg`,
        `${baseURL}audio/sfx/fiveStars.mp3`
      ]); // Credit: "Success 01" by rhodesmas: https://freesound.org/people/rhodesmas
  
      this.load.audio('nextWaveSFX', [
        `${baseURL}audio/sfx/nextWave.ogg`,
        `${baseURL}audio/sfx/nextWave.mp3`
      ]); // Credit: "old fashion radio jingle 2.wav" by rhodesmas: https://freesound.org/people/chimerical
    }
  
    create() {
      // Stop, reassign, and play the new music
      gameState.currentMusic.stop();
      gameState.currentMusic = this.sound.add('gameplayTheme');
      gameState.currentMusic.play({ loop: true });
  
      // Assign SFX
      gameState.sfx = {};
      gameState.sfx.placeFood = this.sound.add('placeFoodSFX');
      gameState.sfx.servingCorrect = this.sound.add('servingCorrectSFX');
      gameState.sfx.servingIncorrect = this.sound.add('servingIncorrectSFX');
      gameState.sfx.servingEmpty = this.sound.add('servingEmptySFX');
      gameState.sfx.fiveStars = this.sound.add('fiveStarsSFX');
      gameState.sfx.nextWave = this.sound.add('nextWaveSFX');
  
      // Create environment sprites
      gameState.floorServer = this.add.sprite(gameState.cam.midPoint.x, 0, 'Floor-Server').setScale(0.5).setOrigin(0.5, 0);
      gameState.floorCustomer = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.worldView.bottom, 'Floor-Customer').setScale(0.5).setOrigin(0.5, 1);
      gameState.table = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'Barrier').setScale(0.5);
  
      // Create player and tray sprites
      gameState.tray = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'Tray').setScale(0.5);
      gameState.player = this.add.sprite(gameState.cam.midPoint.x, 200, 'Chef').setScale(0.5);
  
      // Display the score
      gameState.scoreTitleText = this.add.text(gameState.cam.midPoint.x, 30, 'Score', { fontSize: '15px', fill: '#666666' }).setOrigin(0.5);
      gameState.scoreText = this.add.text(gameState.cam.midPoint.x, gameState.scoreTitleText.y + gameState.scoreTitleText.height + 20, gameState.score, { fontSize: '30px', fill: '#000000' }).setOrigin(0.5);
  
      // Display the wave count
      gameState.waveTitleText = this.add.text(gameState.cam.worldView.right - 20, 30, 'Wave', { fontSize: '64px', fill: '#666666' }).setOrigin(1, 1).setScale(0.25);
      gameState.waveCountText = this.add.text(gameState.cam.worldView.right - 20, 30, gameState.currentWaveCount + '/' + gameState.totalWaveCount, { fontSize: '120px', fill: '#000000' }).setOrigin(1, 0).setScale(0.25);
  
      // Display number of customers left
      gameState.customerCountText = this.add.text(gameState.cam.worldView.right - 20, 80, `Customers left: ${gameState.customersLeftCount}`, { fontSize: '15px', fill: '#000000' }).setOrigin(1);
      
      // Generate wave group
      gameState.customers = this.add.group();
      this.generateWave();
  
      // make customers hungry
      gameState.currentMeal = this.add.group();
      gameState.currentMeal.fullnessValue = 0;
  
      // keyboard controls
      gameState.keys = {};
      gameState.keys.Enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      gameState.keys.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      gameState.keys.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      gameState.keys.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  
      // generate stars group
      gameState.starGroup = this.add.group();
  
  
    }
  
    update() {
  
      if (gameState.readyForNextOrder === true) {
        gameState.readyForNextOrder = false;
        gameState.customerIsReady = false;
  
        if (gameState.currentCustomer) {
          for (let i=0; i<gameState.customersServedCount; i++) {
            this.tweens.add({
                targets: gameState.currentCustomer,
                duration: 750,
                x: '-=300',
                angle: 0,
                onStart: () => {
                    gameState.customers.children.entries[i].meterContainer.visible = false;
                }
            });
            this.tweens.add({
              targets: gameState.customers.children.entries[i],
              duration: 750,
              x: '-=300',
              angle: 0
            });
          }
        }
        gameState.currentCustomer = gameState.customers.children.entries[gameState.customersServedCount];
        
        this.tweens.add({
          targets: gameState.currentCustomer,
          duration: 1000,
          delay: 100,
          angle: 90,
          x: gameState.player.x,
          ease: 'Power2',
          onComplete: () => { 
            gameState.customerIsReady = true;
            gameState.currentCustomer.meterContainer.visible = true;
            gameState.readyForNextOrder = false;
            // gameState.timeLeft = gameState.countdownTimer;
            
          }
        });
  
        this.countdownTimer(gameState.currentCustomer.meterBase);
  
        for (let j=gameState.customersServedCount+1; j<gameState.totalCustomerCount; j++) {
          this.tweens.add({
            targets: gameState.customers.children.entries[j],
            delay: 200,
            x: '-=200',
            duration: 1500
          });
        }
      }
  
       // check for keypresses
       if (Phaser.Input.Keyboard.JustDown(gameState.keys.aKey)) {
         this.placeFood('Burger', 5);
       }
       else if (Phaser.Input.Keyboard.JustDown(gameState.keys.sKey)) {
         this.placeFood('Fries', 3);
       }
       else if (Phaser.Input.Keyboard.JustDown(gameState.keys.dKey)) {
         this.placeFood('Shake', 1);
       }
       else if (Phaser.Input.Keyboard.JustDown(gameState.keys.Enter)) {
         gameState.timer.remove();
         gameState.timeLeft = gameState.countdownTimer;
         this.moveCustomerLine();
        //  this.updateCustomerCountText();
        }
  
    }
  
    countdownTimer(timeBar) {
          // timer
      gameState.timeLeft = gameState.countdownTimer;
      // let timeBar = this.add.rectangle(200, 200, 200, 33, 0x3ADB40);
      // let timeBar = meterBase;
      let timeBarMask = this.add.rectangle(timeBar.x, timeBar.y, timeBar.width, timeBar.height, 0x707070);
  
      timeBarMask.visible = false;
      timeBar.mask = new Phaser.Display.Masks.BitmapMask(this, timeBarMask);
      var text;
  
      gameState.timer = this.time.addEvent({
        delay: 500,
        callback: () => {
          if (text) text.destroy();
          text = this.add.text(200, 200, `${gameState.timeLeft}`);
          gameState.timeLeft--;
          let stepWidth = timeBarMask.displayWidth / gameState.countdownTimer;
          timeBarMask.x -= stepWidth;
          
          if (gameState.timeLeft < 8) {
              timeBar.setFillStyle(0xFFFA81);
          }
          if (gameState.timeLeft < 4) {
              timeBar.setFillStyle(0xDB533A);
          }
            if(gameState.timeLeft == 0){
              gameState.timeLeft = gameState.countdownTimer;
              timeBarMask.x = timeBar.x;
              // timeBar.setFillStyle(0x3ADB40);
              // timeBar.visible = false;
              
              gameState.timer.remove();
              this.moveCustomerLine();
              // this.updateCustomerCountText();   
            }
        },
        callbackScope: this,
        loop: true
      });
    }
  
    placeFood(food, fullnessValue) {
  
      if (gameState.currentMeal.children.entries.length < 3 && gameState.customerIsReady === true) {
  
        let xPosition = gameState.tray.x;
  
        switch (gameState.currentMeal.children.entries.length) {
          case 0:
            xPosition -= 90;
            break;
          case 2:
            xPosition += 100;
            break;
        }
  
        gameState.currentMeal.create(xPosition, gameState.tray.y, food).setScale(0.6);
  
        gameState.currentMeal.fullnessValue += fullnessValue;
  
        for (let i = 0; i < gameState.currentMeal.fullnessValue; i++) {
          if (i > gameState.currentCustomer.fullnessCapacity || gameState.currentMeal.fullnessValue > gameState.currentCustomer.fullnessCapacity) {
            for (let j = 0; j < gameState.currentCustomer.fullnessCapacity; j++) {
              gameState.currentCustomer.fullnessMeterBlocks[j].setFillStyle(0xDB533A);
              gameState.currentCustomer.fullnessMeterBlocks[j].setStrokeStyle(2, 0xB92E2E);
            }
          }
          if (i < gameState.currentCustomer.fullnessCapacity) {
            gameState.currentCustomer.fullnessMeterBlocks[i].setFillStyle(0xFFFA81);
          }
          if (gameState.currentMeal.fullnessValue === gameState.currentCustomer.fullnessCapacity) {
            gameState.currentCustomer.fullnessMeterBlocks[i].setFillStyle(0x3ADB40);
            gameState.currentCustomer.fullnessMeterBlocks[i].setStrokeStyle(2, 0x2EB94E);
          }
        }
  
        gameState.sfx.placeFood.play();
  
      }
    }
  
    moveCustomerLine() {
      gameState.customersServedCount++;
      this.updateCustomerCountText()
      this.updateStars(gameState.currentMeal.fullnessValue, gameState.currentCustomer.fullnessCapacity);
      gameState.currentMeal.clear(true);
      gameState.currentMeal.fullnessValue = 0;
      
      if (gameState.starRating === 0) {
        this.scene.stop('GameScene');
        this.scene.start('LoseScene');
      }
  
      if (gameState.customersServedCount == gameState.totalCustomerCount) {
        this.scene.stop('GameScene');
        this.scene.start('WinScene');
        // gameState.readyForNextOrder = false;
  
        // this.add.text(100, 100, `${gameState.customersLeftCount}`);
        // this.destroyWave();
        // gameState.currentWaveCount++;
        // gameState.gameSpeed--;
        // this.generateWave();
      }
  
      // if (gameState.currentWaveCount === gameState.totalWaveCount) {
      //   // end game
      // }
  
      gameState.readyForNextOrder = true;
      gameState.timeLeft = gameState.countdownTimer;
      gameState.timer.remove();
    }
  
    destroyWave() {
      gameState.sfx.nextWave.play();
      for (let j=0; j<gameState.totalCustomerCount; j++) {
          this.tweens.add({
            targets: gameState.customers.children.entries[j],
            delay: 200,
            x: '-=500',
            duration: 10
          });
        }
      for (let i=0; i<gameState.totalCustomerCount; i++) {
        gameState.currentCustomer.destroy();
        gameState.customers.destroy();
      }
    }
  
    drawStars() {
      for (let i = 0; i < gameState.starRating; i++) {
            let spacer = i * 50;
            gameState.starGroup.create(20 + spacer, 20, 'Star-full').setScale(0.6);
      }
    }
  
    updateStars(fullnessValue, fullnessCapacity) {
      gameState.starGroup.clear(true);
      if (fullnessValue === fullnessCapacity) {
        gameState.currentCustomer.list[0].setTint(0x3ADB40);
        gameState.sfx.servingCorrect.play();
        gameState.score += 100;
        gameState.scoreText.setText(`${gameState.score}`);
        if(gameState.starRating < 5){
            gameState.starRating++;
        }
        if (gameState.starRating === 5){
            gameState.sfx.fiveStars.play();
        }
      }
      else if (fullnessValue < fullnessCapacity) {
        gameState.currentCustomer.list[0].setTint(0xDB533A);
        gameState.sfx.servingIncorrect.play();
        gameState.starRating -= 2;
        if (gameState.starRating < 0) {
          gameState.starRating = 0;
        }
      }
      else if (fullnessValue > fullnessCapacity) {
        gameState.currentCustomer.list[0].setTint(0xDB9B3A);
        gameState.sfx.servingEmpty.play();
        gameState.starRating -= 1;
        if (gameState.starRating < 0) {
          gameState.starRating = 0;
        }
      }
      this.drawStars();
    }
  
    /* WAVES */
    // Generate wave
    generateWave() {
      // Add the total number of customers per wave here:
      gameState.totalCustomerCount = Math.ceil(Math.random() * 10);
  
     this.updateCustomerCountText();   
  
      for (let i = 0; i < gameState.totalCustomerCount; i++) {
        // Create your container below and add your customers to it below:
        let customerContainer = this.add.container(gameState.cam.worldView.right + (200 * i), gameState.cam.worldView.bottom - 140);
  
        gameState.customers.add(customerContainer);
  
        // Customer sprite randomizer
        let customerImageKey = Math.ceil(Math.random() * 5);
  
        // Draw customers here!
        let customer = this.add.sprite(0, 0, `Customer-${customerImageKey}`).setScale(0.5);
  
        customerContainer.add(customer);
  
        // Fullness meter container
        customerContainer.fullnessMeter = this.add.group();
  
        // Define capacity
        customerContainer.fullnessCapacity = Math.ceil(Math.random() * 5 * gameState.totalWaveCount);
  
        // If capacity is an impossible number, reshuffle it until it isn't
        while (customerContainer.fullnessCapacity === 12 || customerContainer.fullnessCapacity === 14) {
          customerContainer.fullnessCapacity = Math.ceil(Math.random() * 5) * gameState.totalWaveCount;
        }
  
        // Edit the meterWidth
        let meterWidth = customerContainer.fullnessCapacity * 10;
        customerContainer.meterContainer = this.add.container(0, customer.y + (meterWidth / 2));
        
        // Add the customerContainer.meterContainer to customerContainer
        customerContainer.add(customerContainer.meterContainer);
  
        // Add meter base
        customerContainer.meterBase = this.add.rectangle(-130, customer.y, meterWidth, 33, 0x3ADB40).setOrigin(0);
        customerContainer.meterBase.setStrokeStyle(6, 0x707070);
        customerContainer.meterBase.angle = -90;
        customerContainer.meterContainer.add(customerContainer.meterBase);
        
        // this.countdownTimer(customerContainer.meterBase);
  
        // Create container for individual fullness blocks
        customerContainer.fullnessMeterBlocks = [];
  
        // Create fullness meter blocks
        for (let j = 0; j < customerContainer.fullnessCapacity; j++) {
          customerContainer.fullnessMeterBlocks[j] = this.add.rectangle(customerContainer.meterBase.x, customer.y - (10 * j), 10, 20, 0xDBD53A).setOrigin(0);
          customerContainer.fullnessMeterBlocks[j].setStrokeStyle(2, 0xB9B42E);
          customerContainer.fullnessMeterBlocks[j].angle = -90;
          customerContainer.fullnessMeter.add(customerContainer.fullnessMeterBlocks[j]);
          customerContainer.meterContainer.add(customerContainer.fullnessMeterBlocks[j]);
        }
  
  
        // Hide meters
        customerContainer.meterContainer.visible = false;
      }
    }
  }