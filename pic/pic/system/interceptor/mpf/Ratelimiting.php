<?php
//mpf_require_class("MPF_Ratelimiting");
mpf_require_class('MPF_Cache_Factory');

class MPF_RatelimitingInterceptor extends MPF_Interceptor {

    public function before() {
        $this->process_vews();
        return self::STEP_CONTINUE;
    }

    public function after() {
        return self::STEP_CONTINUE;
    }
	
	
	private function get_views($idorip) {
		
		$cache = MPF_Cache_Factory::get_instance()->get_memcache();
		if(!cache) return false;
		$views = $cache->get($idorip);
		return $views;
		//return $views[$idorip]=array('t'=>1,'c'=>1);
	}
	private function set_views($idorip,$inc=1,$time=0) {
		$cache = MPF_Cache_Factory::get_instance()->get_memcache();
		if(!cache) return false;
		$views = $cache->get($idorip);
		if($time){
			$views['t']=$views['t']-$time;
		}
		$views['c']=$views['c']+$inc;
		$cache->set($idorip,$views,0,172800);
		/*if($time)
			return $views[$idorip]=array('t'=>time()-$time,'c'=>1+$inc); //更新计时和计数
		return $views[$idorip]=array('t'=>time(),'c'=>1+$inc); //更新计数*/
	}
	//流量控制 -- 触及限制需提交验证码
	private function process_vews() {
		/*
			0、新IP、新标识/无标识，（不限制访问 -- 不能防止有大型IP库的访问者），（限流服务 -- 1秒内访问不超过5000次，5分钟内访问不超过300000次）；
			1、老标识、老IP（固定设备、AJAX？、资源？），2秒钟内访问不超过5次、1分钟内访问不超过50次、1小时内访问不超过500次、1天内访问不超过1000次；
			2、老标识、新IP（移动设备、AJAX？、资源？），2秒钟内访问不超过5次、1分钟内访问不超过50次、1小时内访问不超过500次、1天内访问不超过1000次；
			3、老IP、新标识/无标识（NAT环境、爬虫？），2秒钟内访问不超过5次、1分钟内访问不超过50次、1小时内访问不超过500次、1天内访问不超过1000次；
		*/
		$ip = MPF::get_instance()->request->get_client_ip();
		$id = $_COOKIE['ECM_ID']?$_COOKIE['ECM_ID']:SID;//todo
		$t = time();
		if ($idviews=$this->get_views($id)) {
			$this->set_views($id);
			if ($ipviews=$this->get_views($ip)) {  //1、
				$this->set_views($ip);
				if ($t-$ipviews['t'] >= 86400 && $t-$idviews['t'] >= 86400) {
					if ($ipviews['c']>300 && $idviews['c']>300) {
						//todo
						MPF::get_instance()->response->set_header('_pvp','1.1');
					} elseif (($t-$ipviews['t'])/2>=86400) {
						$this->set_views($id,-300,86400);
						$this->set_views($ip,-300,86400);
					}
				} elseif ($t-$ipviews['t'] >= 3600 && $t-$idviews['t'] >= 3600) {
					if ($ipviews['c']>100 && $idviews['c']>100) {
						//todo
						MPF::get_instance()->response->set_header('_pvp','1.2');
					} elseif (($t-$ipviews['t'])/2>=3600) {
						$this->set_views($id,-100,3600);
						$this->set_views($ip,-100,3600);
					}
				} elseif ($t-$ipviews['t'] >= 60 && $t-$idviews['t'] >= 60) {
					if ($ipviews['c']>10 && $idviews['c']>10) {
						//todo
						MPF::get_instance()->response->set_header('_pvp','1.3');
					} elseif (($t-$ipviews['t'])/2>=60) {
						$this->set_views($id,-10,60);
						$this->set_views($ip,-10,60);
					}
				} elseif ($t-$ipviews['t'] >= 2 && $t-$idviews['t'] >= 2) {
					if ($ipviews['c']>1 && $idviews['c']>1) {
						//todo
						MPF::get_instance()->response->set_header('_pvp','1.4');
					} elseif (($t-$ipviews['t'])/2>=2) {
						$this->set_views($id,-1,2);
						$this->set_views($ip,-1,2);
					}
				}
			} else { //2、
				if ($t-$idviews['t'] >= 86400) {
					if ($idviews['c']>300) {
						//todo
						MPF::get_instance()->response->set_header('_pvp','2.1');
					} elseif (($t-$ipviews['t'])/2>=86400) {
						$this->set_views($id,-300,86400);
						$this->set_views($ip,-300,86400);
					}
				} elseif ($t-$idviews['t'] >= 3600) {
					if ($idviews['c']>100) {
						//todo
						MPF::get_instance()->response->set_header('_pvp','2.2');
					} elseif (($t-$ipviews['t'])/2>=3600) {
						$this->set_views($id,-100,3600);
						$this->set_views($ip,-100,3600);
					}
				} elseif ($t-$idviews['t'] >= 60) {
					if ($idviews['c']>10) {
						//todo
						MPF::get_instance()->response->set_header('_pvp','2.3');
					} elseif (($t-$ipviews['t'])/2>=60) {
						$this->set_views($id,-10,60);
						$this->set_views($ip,-10,60);
					}
				} elseif ($t-$idviews['t'] >= 2) {
					if ($idviews['c']>1) {
						//todo
						MPF::get_instance()->response->set_header('_pvp','2.4');
					} elseif (($t-$ipviews['t'])/2>=2) {
						$this->set_views($id,-1,2);
						$this->set_views($ip,-1,2);
					}
				}
			}
		} elseif ($ipviews=$this->get_views($ip)) {  //3、
			$this->set_views($ip);
			if ($t-$ipviews['t'] >= 86400) {
				if ($ipviews['c']>300) {
					//todo
					MPF::get_instance()->response->set_header('_pvp','3.1');
				} elseif (($t-$ipviews['t'])/2>=86400) {
						$this->set_views($id,-300,86400);
						$this->set_views($ip,-300,86400);
					}
			} elseif ($t-$ipviews['t'] >= 3600) {
				if ($ipviews['c']>100) {
					//todo
					MPF::get_instance()->response->set_header('_pvp','3.2');
				} elseif (($t-$ipviews['t'])/2>=3600) {
						$this->set_views($id,-100,3600);
						$this->set_views($ip,-100,3600);
					}
			} elseif ($t-$ipviews['t'] >= 60) {
				if ($ipviews['c']>10) {
					//todo
					MPF::get_instance()->response->set_header('_pvp','3.3');
				} elseif (($t-$ipviews['t'])/2>=60) {
						$this->set_views($id,-10,60);
						$this->set_views($ip,-10,60);
					}
			} elseif ($t-$ipviews['t'] >= 2) {
				if ($ipviews['c']>1) {
					//todo
					MPF::get_instance()->response->set_header('_pvp','3.4');
				} elseif (($t-$ipviews['t'])/2>=2) {
						$this->set_views($id,-1,2);
						$this->set_views($ip,-1,2);
					}
			}
		} else {  //0、
			$this->set_views($id); //+1
			$this->set_views($ip); //+1
			$this->set_views("nid_nip"); //+1
		}
	}
}
