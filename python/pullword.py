# -*- coding: utf-8 -*-  
from pullword import pullword 
word_list = pullword(u"华中科技大学")
wrod_list = pullword(u"华中科技大学", debug=0)
word_list = pullword(u"华中科技大学", threshold=0.7)
