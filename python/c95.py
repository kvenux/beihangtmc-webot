import os,sys

def updateCareer(num):
    print 'BeihangTMC %sth Meeting...'%num
    print 'Transforming data from roleassign to roletaken...'
    num=str(num)
    #inputfile=open('../roleassign.csv','r')
    #lines=inputfile.readlines()
    #assign_title=lines[0][:len(lines[0])-2].split(',')

    roletaken_fl=open('../roletaken_new.csv','r')
    roletaken_lines=roletaken_fl.readlines()
    roletaken_fl.close()
    roletaken_title=roletaken_lines[0].split(',')
    rt_mat=[]
    for line in roletaken_lines:
        items=line.split(',')
        rt_row=[]
        for item in items:
            rt_row.append(item)
        rt_mat.append(rt_row)
    #print rt_mat
    member_num=len(rt_mat)


    #for line in lines:
        #line=line[:len(line)-2]
        ##print line
        #items=line.split(',')
        #if(cmp(items[0],num)==0):
            #lenth=len(items)
            #for i in range(1,lenth):
                #name=items[i]
                #title=assign_title[i]
                #print 'Role assign info: ',name,title
                #if 'Evaluator' in assign_title[i]:
                    ##title=assign_title[i][:-1]
                    #title='Evaluator'
                    #rt_mat=increMat(rt_mat,name,title)
                #elif 'Speaker' in assign_title[i]:
                    #title='Speech'
                    #rt_mat=increMat(rt_mat,name,title)
                    #title='CC'
                    #rt_mat=increMat(rt_mat,name,title)
                #else:
                    #rt_mat=increMat(rt_mat,name,title)
            #break
    namelist=[]
    namelist.append('Keven')
    namelist.append('Doris')
    namelist.append('Jane')
    namelist.append('MaunaLoa')
    namelist.append('Vicky')
    namelist.append('Bowen')
    namelist.append('Winston')
    for name in namelist:
        title='Speech'
        rt_mat=increMat(rt_mat,name,title)
        title='CC'
        rt_mat=increMat(rt_mat,name,title)
    evalist=[]
    evalist.append('Sophie')
    evalist.append('Lucia')
    evalist.append('Keven')
    evalist.append('Doris')
    evalist.append('Jane')
    evalist.append('Vicky')
    evalist.append('Jill')
    for name in evalist:
        title='Evaluator'
        rt_mat=increMat(rt_mat,name,title)
    name='Isabelle'
    title='Timer'
    rt_mat=increMat(rt_mat,name,title)
    name='Grace2'
    title='Ah-Counter'
    rt_mat=increMat(rt_mat,name,title)
    name='Summers'
    title='Grammarian'
    rt_mat=increMat(rt_mat,name,title)
    name='Elena'
    title='TM'
    rt_mat=increMat(rt_mat,name,title)
    name='Lucia'
    title='GE'
    rt_mat=increMat(rt_mat,name,title)
    name='Grace'
    title='GE'
    rt_mat=increMat(rt_mat,name,title)

    #print rt_mat

    #return

    for i in range(1,len(rt_mat)):
        sum=int(rt_mat[i][3])
        sum+=int(rt_mat[i][4])
        sum+=int(rt_mat[i][6])
        sum+=int(rt_mat[i][7])
        sum+=int(rt_mat[i][8])
        sum+=int(rt_mat[i][9])
        sum+=int(rt_mat[i][10])
        sum+=int(rt_mat[i][11])
        sum+=int(rt_mat[i][13])
        rt_mat[i][14]=str(sum)
    rt_mat[0][14]='intotal'
    print 'Output to File ../roletaken_new.csv'
    output_fl=open('../roletaken_new.csv','w')
    outlines=[]
    for matrow in rt_mat:
        outlines.append(','.join(matrow)+'\n')
    #print outlines
    output_fl.writelines(outlines)


def increMat(mat,name,role):
    flag=0
    for row in range(len(mat)):
        if(cmp(name,mat[row][1])==0):
            for col in range(len(mat[row])):
                #print role,mat[0][col]
                if(cmp(role,mat[0][col])==0):
                    #print 'bingo ',name,role,mat[row][col]
                    flag=1
                    if(cmp(role,'CC')==0):
                        num=int(mat[row][col][2:])+1
                        mat[row][col]='CC%d'%num
                    else:
                        mat[row][col]=str(int(mat[row][col])+1)
                    print 'Update %s\'s %s to %s'%(name,role,mat[row][col])
                    #print mat[row][col]
                    pass
    if(flag==0):
        print 'Not found %s %s'%(name,role)
    return mat

def searchList(items,key):
    for i in range(0,len(items)):
        if(cmp(item[i],key)==0):
            return i

#updateCareer(92)
#updateCareer(93)
updateCareer(95)
