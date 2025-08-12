/**
 *@name     jquery.barrager.js
 *@version  1.1
 *@author   yaseng@uauc.net
 *@url      https://github.com/yaseng/jquery.barrager.js
 */
(function($) {
	$.fn.barrager = function(barrage) {
		barrage = $.extend({
			close: true,
			max: 10,
			speed: 16,
			color: '#ffffff',
		}, barrage || {});

		const time = new Date().getTime();
		const barrager_id = 'barrage_' + time;
		const id = '#' + barrager_id;
		const div_barrager = $("<div class='barrage' id='" + barrager_id + "'></div>").appendTo($(this));
		const this_height = $(window).height() * 0.35;
		const this_width = $(window).width() + 100;
		const array = [
			(this_height / 5) + $(window).height() * 0.5,
			2*(this_height / 5) + $(window).height() * 0.5,
			3*(this_height / 5) + $(window).height() * 0.5,
			4*(this_height / 5) + $(window).height() * 0.5,
			5*(this_height / 5)   + $(window).height() * 0.5
		]
		const bottom =array[Math.floor(Math.random()*5)];

		div_barrager.css("bottom", bottom + "px");
		div_barrager_box = $("<div class='barrage_box cl'></div>").appendTo(div_barrager);
		if(barrage.img){
			div_barrager_box.append("<a class='portrait z' href='javascript:;'></a>");
			const img = $("<img src='' >").appendTo(id + " .barrage_box .portrait");
			img.attr('src', barrage.img);
		}
		div_barrager_box.append(" <div class='z p'></div>");
		if(barrage.close){
			div_barrager_box.append(" <div class='close z'></div>");
		}

		const content = $("<a title='' href='' target='_blank'></a>").appendTo(id + " .barrage_box .p");
		content.attr({
			'href': barrage.href,
			'id': barrage.id
		}).empty().append(barrage.info);
		content.css('color', barrage.color);

		const i = 0;
		div_barrager.css('margin-right', 0);
		
 		$(id).animate({right:this_width},barrage.speed*1000,function()
		{
			$(id).remove();
		});

		div_barrager_box.mouseover(function()
		{
		     $(id).stop(true);
		});

		div_barrager_box.mouseout(function()
		{
			$(id).animate({right:this_width},barrage.speed*1000,function()
			{
				$(id).remove();
			});
 		});

		$(id+'.barrage .barrage_box .close').click(function()
		{
			$(id).remove();
		})
	}


	$.fn.barrager.removeAll=function()
	{
		 $('.barrage').remove();
	}

})(jQuery);



// ========== 联系页面弹幕功能扩展 ==========

/**
 * 弹幕模态框控制函数
 */
function openBarrageModal() {
    const modal = document.getElementById('barrageModal');
    modal.classList.add('show');
    // 清空输入框
    document.getElementById('barrage-info').value = '';
    document.getElementById('barrage-href').value = '';
    document.getElementById('barrage-speed').value = '15';
    // 聚焦到第一个输入框
    setTimeout(() => {
        document.getElementById('barrage-info').focus();
    }, 100);
}

function closeBarrageModal() {
    const modal = document.getElementById('barrageModal');
    modal.classList.remove('show');
}

function sendBarrage() {
    const info = document.getElementById('barrage-info').value.trim();
    const href = document.getElementById('barrage-href').value.trim();
    const speed = parseInt(document.getElementById('barrage-speed').value);

    // 验证输入
    if (!info) {
        alert('请输入弹幕内容！');
        return;
    }

    if (speed < 5 || speed > 20) {
        alert('弹幕速度必须在5-20之间！');
        return;
    }

    // 使用原有的弹幕发送逻辑
    const finalInfo = info || "hello world";
    const finalHref = href || "https://lo-y-eh.github.io/404";
    const finalSpeed = (speed < 5 || speed > 20) ? Math.floor(10 * Math.random()) + 5 : speed;

    const r = AV.Object.extend("barrager");
    const t = new r;
    t.set("href", finalHref);
    t.set("info", finalInfo);
    t.set("speed", finalSpeed);

    t.save().then(e => {
        // 显示成功消息
        showMessage('弹幕发送成功！', 'success');
        closeBarrageModal();
    }).catch(error => {
        showMessage('弹幕发送失败，请重试！', 'error');
        console.error('发送弹幕失败:', error);
    });
}

function closeAllBarrage() {
    if (confirm('确定要关闭所有弹幕显示吗？')) {
        $.fn.barrager.removeAll();
        showMessage('弹幕显示已关闭！', 'success');
        closeBarrageModal();
    }
}

// 显示消息提示
function showMessage(text, type = 'info') {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: messageSlideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
    }

    messageDiv.textContent = text;
    document.body.appendChild(messageDiv);

    // 自动移除消息
    setTimeout(() => {
        messageDiv.style.animation = 'messageSlideOut 0.3s ease-in';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// 原有的表单弹幕发送功能（兼容性保留）
function run() {
    let e = $("input[name=info]").val()
        , n = (e = "" === e ? "hello world" : e,
            $("input[name=href]").val())
        , a = (n = "" === n ? "https://lo-y-eh.github.io/404" : n,
            parseInt($("input[name=speed]").val()));
    (20 < a || a < 5) && (a = Math.floor(10 * Math.random()) + 5);
    const r = AV.Object.extend("barrager")
        , t = new r;
    t.set("href", n),
        t.set("info", e),
        t.set("speed", a),
        t.save().then(e => {
            $(" input[ name='info' ] ").val(""),
                $(" input[ name='href' ] ").val(""),
                $(" input[ name='speed' ] ").val("")
        }
        )
}

function clear_barrage() {
    $.fn.barrager.removeAll()
}

// DOM加载完成后初始化
$(document).ready(function() {
    // 添加消息动画样式
    const messageStyle = document.createElement('style');
    messageStyle.textContent = `
        @keyframes messageSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes messageSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(messageStyle);

    // 如果在联系页面，初始化弹幕相关事件
    if (document.getElementById('barrageModal')) {
        // 点击模态框外部关闭
        document.getElementById('barrageModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeBarrageModal();
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('barrageModal');
                if (modal.classList.contains('show')) {
                    closeBarrageModal();
                }
            }
        });

        // 回车键发送弹幕
        const barrageInfo = document.getElementById('barrage-info');
        if (barrageInfo) {
            barrageInfo.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendBarrage();
                }
            });
        }
    }

    // 初始化弹幕显示（如果在联系页面且有弹幕数据）
    if (typeof AV !== 'undefined' && document.getElementById('contact')) {
        async function do_barrager() {
            let lists = [];
            const query = new AV.Query("barrager")
                , barrager = await query.find().then(e => {
                    lists = e
                }
                );
            let length = lists.length
                , index = 0;
            const timer = setInterval(() => {
                if (index === length)
                    clearInterval(timer),
                        do_barrager();
                else {
                    let obj = lists[index]
                        , jsonObject = eval("(" + JSON.stringify(obj) + ")");
                    $("body").barrager({
                        img: "/medias/barrager/" + Math.floor(10 * Math.random()) + ".png",
                        href: jsonObject.href,
                        info: jsonObject.info,
                        speed: jsonObject.speed - 5
                    }),
                        index++
                }
            }
                , 900)
        }
        do_barrager()
    }
});
