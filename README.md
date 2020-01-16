cowsay-files
============

These files are intended to supplement the cow files in /usr/share/cowsay/cows.

    echo Exterminate! | cowsay -f dalek

## examples

[A sample of each cow file in this repository is here](examples.md). Note that the ANSI cows like [bender.cow](https://github.com/paulkaefer/cowsay-files/blob/master/cows/bender.cow) will only render properly if your terminal client supports color. True color (ending in '-tc') cows will only render in terminals that support full 24-bit color.

## .cowrc file
This file allows you to configure a list of cows to randomly display when opening a new terminal session.
- Note - this file counts on [fortune](https://formulae.brew.sh/formula/fortune) being installed to display your random fortunes.

Can be made use of by adding the following line to your `.bashrc` file (or `.zshrc` if you use ZSH):

```
. ${GIT}/cowsay-files/.cowrc
```

Replace ${GIT} with the path to your git directory, and you will get a random cow fortune on every new terminal session :)

## .bashrc file. 
If you want to have random cows everytime that you login or open a shell add this to your `.bashrc`.

```bash
COWS=($(GIT)/cowsay-files/cows/*)
RAND_COW=$(($RANDOM % $( ls $(GIT)/cowsay-files/cows/*.cow | wc -l )))
cowsay -f ${COWS[$RAND_COW]} "ALL YOUR BASE ARE BELONG TO US"
```
Replace ${GIT} with the path to your git directory, and you will get a random cow on every new terminal session. 


## Cowsay file converter
Fancy pixel art cows can now be created with ease using [Charc0al's cowsay file converter](https://charc0al.github.io/cowsay-files/converter)

Instructions:
1. Create PNG or other uncompressed image of the size you want (recommend no larger than 50 x 50). I recommend using GIMP.
   - Note: The first (upper-left) pixel (0, 0) color is assumed to be background color and will not appear in the cowsay image.
   - Colors will be mapped to default bash color palette, any colors in your image that are not part of the 256 color bash palette
     will be mapped to the nearest color in the palette.
2. Upload image in converter & press Convert!
3. Enjoy!

Tips for creating pixel art cows:  
- For manually editing colors or creating cows, you can run the `palette` command (if you are making use of .cowrc) to get
a display of your terminal color palette and the corresponding color codes.
- If you are scaling down a pixel art image from a larger size, make sure to set "Interpolation" to None/Off or you will get
color bleed between pixels
- It is helpful to use a background color that is bright and very different from all other colors on your image
so you can clearly see which pixels are background and which are image. I usually use hot pink or neon green.

Try converting some of the [examples](https://charc0al.github.io/cowsay-files/converter/examples)!

![Donatello](https://charc0al.github.io/cowsay-files/converter/src_images/donatello.png)
![Link](https://charc0al.github.io/cowsay-files/converter/src_images/link.png)
![Pikachu2](https://charc0al.github.io/cowsay-files/converter/src_images/pikachu2.png)
![Batman](https://charc0al.github.io/cowsay-files/converter/src_images/batman.png)
