import os
import sys

def updateNum(num):
    roleassign=open('../roleassign.csv')
    lines=roleassign.readlines()
    titleline=lines[0]
    titles=titleline.split(',')
    lines=lines[1:]
    for line in lines:
        items=line.split(',')
        if(cmp(num,items[0])==0):
            #print 'bingo'
            outfile=open('../rolehis.csv')
            outlines=outfile.readlines()
            names=outlines[0].split(',')
            lenth=len(outlines)
            print line
            for j in range(lenth):
                outline=outlines[j]
                outwords=outline.split(',')
                if(cmp(outwords[0],num)==0):
                    print outwords
                    index=0
                    for index in range(2,len(names)):
                        for i in range(13):
                            if(items[i]==''):
                                continue

                            if(names[index] in items[i] or items[i] in names[index]):
                                print names[index],items[i]
                                outwords[index]=titles[i]
                                break
                    #print outwords
                    print ','.join(outwords)
            #for i in range(10):
                #print titles[i+1],items[i+1]


#updateNum('89')
updateNum('90')
#updateNum('91')
#updateNum('92')
#updateNum('93')
