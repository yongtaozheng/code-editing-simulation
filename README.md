# 代码编辑模拟插件

![1746199494274](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746199494274.png)

视频介绍：[https://mp.weixin.qq.com/s/ZUXj4aO0TFazrmTd3WSaoQ](https://mp.weixin.qq.com/s/ZUXj4aO0TFazrmTd3WSaoQ)

## 功能简介

模拟手打逐字输入效果，可以用于视频录制时重现代码实现过程。

## 用法

### 右键菜单栏

在文件编辑区域右键打开菜单栏，可以看到模拟代码输入这一个选项，鼠标悬浮可以看到子菜单邮有两个功能。

![1746198710220](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746198710220.png)

### 修改配置

选择子菜单栏中的修改配置选项，可以修改插件的相关配置，具体配置如下：

![1746198960410](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746198960410.png)

#### 保存标识

在自动输入的过程中，识别到保存标识的时候会触发保存事件，将文件保存，默认保存标识为：**@保存@**。
比如使用canvas绘制图像的时候，我们可以在画完一笔的时候保存一下，这时候可以直观的看到每一笔的绘制效果。

#### 打印速度（毫秒/字符）

字符输入的速度，默认是50，即每50毫秒输入一个字符。

#### 默认文件（初始化为default.txt）

可以设置默认文件，如果默认文件存在，执行模拟代码输入的时候就不用手动二次选择文件，会直接读取设置的文件内容来执行输入操作。

### 模拟代码输入

插件核心功能，模拟代码手打逐字输入的效果，使用方式如下：

#### 在当前光标所在位置全量插入代码

- 首先需要新建一个txt文件，在文件中准备好需要输入的代码，如下图，我们有一个code.txt文件，里面有几行代码。

  ![1746199693300](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746199693300.png)
- 在需要插入代码的地方右键选择模拟代码输入，也可以直接使用快捷键（Ctrl+Alt+C）

  ![1746199893252](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746199893252.png)
- 在弹出的文件选择框中选择需要插入的代码文件，这里选择我们前面准备的code.txt

  ![1746200011228](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746200011228.png)
- 选择好文件后，插件就会将文件中的代码插入到当前光标的位置中去

  ![1746200074619](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746200074619.png)

#### 根据标识符在对应位置插入代码

- 同样需要新建一个txt文件，在文件中准备好需要输入的代码，这里的代码格式需要进行调整，具体格式如下，每一段代码都有一个中括号标签包着：

  ![1746200266594](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746200266594.png)
- 中括号里的标识需要与原代码中的标识一致，对应标签中的代码会被插到对应标识之后，如下图：

  ![1746200394262](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746200394262.png)
- 在需要插入代码的文件中右键选择模拟代码输入，也可以直接使用快捷键（Ctrl+Alt+C）

  ![1746199893252](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746199893252.png)
- 在弹出的文件选择框中选择需要插入的代码文件，这里选择我们前面准备的index.txt

  ![1746200553598](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746200553598.png)
- 选择好文件后，插件就会将文件中每个标识标签中的代码插入到对应标识所在的位置中去

  ![1746200636367](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1746200636367.png)


#### 停止输入

输入过程中可以进行终止输入操作，右键菜单栏选择停止输入或者直接使用快捷键 ctrl+alt+v

![1747587937044](https://gitee.com/zheng_yongtao/code-editing-simulation/raw/master/images/README/1747587937044.png)

## 联系作者

### 公众号

关注公众号『 **前端也能这么有趣** 』，获取更多有趣内容。

发送 **加群** 还可以加入群聊，一起来学习（摸鱼）吧~

### 源码地址

[https://gitee.com/zheng_yongtao/code-editing-simulation.git](https://gitee.com/zheng_yongtao/code-editing-simulation.git)

> 🌟 觉得有帮助的可以点个 star~
> 🖊 有什么问题或错误可以指出，欢迎 pr~
> 📬 有什么想要实现的功能或想法可以联系我~
