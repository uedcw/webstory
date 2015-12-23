# Micro PHP Framework

#########################################################################

UP: APF::dispatch()方法之前允许返回／设置route配置

ADD: 添加route分组支持

ADD: 添加autoload支持

ADD: 添加fastcgi_finish_request支持

ADD: 添加富文本处理函数strip_tags_content

UP: 使用preg_*函数替代即将过期的ereg函数，移除define_syslog_variables的使用

ADD: 添加mysqli、mdb2支持

ADD: 添加域名hash支持，基于time33算法

ADD：debug工具添加inc支持

ADD: OAuth2.0    http://oauth.net/2/

#########################################################################

添加route分组支持：
    使用GroupRouter替换原来Router类
    新的配置格式为，原来在配置可以使用save_asgroups()方法完成转换工作
$config['group_mappings']=array(
    '/home'=>array(
        'apf_resource_Resources'=>array(
            '/error/(?<id>[\d]+)',
            '/view/(?<id>[\d]+)',
        ),
    ),
)

添加autoload支持：
    取消apf_require_file以外的系列函数，不符合自动加载规则的类，勿必使用apf_require_file进行手动加载。

添加fastcgi_finish_request支持：
    #通过将代码的执行过程放入shutdown阶段使得php尽早的释放与app服务的联系，缩短app占用时间
    APF::get_instance()->register_finish_function(array($this, "shutdown"));

添加富文本处理函数strip_tags_content，用于解决页面中的xxs风险：
    #建议将处理的tag写在配置文件中
    #提供可选项支持：1、是否对不完整的标签进行处理；2、是保留指定标签还是删除指定标签；3、是否保留标签内的inner文本
    $text = '<div>testdiv</div><a>testa</a>';
    $tags = APF::get_instance()-get_config('allowtags','tags');                        
    $text = APF_Util_StringUtils::strip_tags_content($text, '<a>', false, false, true); 
    

