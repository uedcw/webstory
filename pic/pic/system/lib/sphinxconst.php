<?php

define ( "SPHINX_RANK_EXPR",            "sum((8*wlccs*lccs+4*lcs+2*(min_hit_pos==1)+exact_hit)*user_weight)*1000+bm25*10" );