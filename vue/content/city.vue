<template>
  <div class="city_select" >
        <div class="city_value" @click="showUl">{{cityvalue}}</div>
        <span :class="showul ? 'city_img_bottom' : 'city_img_top'"></span>
        <div :class="showul ? 'city_list' : 'hidden'">
            <div class="city_title">
                <div :class='titleclick == index ? "city_title_click" : "city_title_list"'
                v-for="(item, index) in titlelist"
                :key="index" 
                @click="handleTitle(index)">{{item}}</div>
            </div>

            <div :class='titleclick == indexs ? "ul" : "hidden"'
                v-for="(items, indexs) in datalist" 
                :key="indexs">
                <div v-for="(itemchild, indexchild) in items" :key="indexchild"
                    :class='clickList[indexs] == indexchild ? "liclicked" : "li" '
                    @click="getData(indexs,indexchild,itemchild)">
                        {{itemchild.name}}
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
    import u from '../../js/utils'
    export default {
        data (){
            return {
                showul:false,  		//是否显示选择列表
                titlelist:['省份'], 		//头部信息
                titleclick:0,   	//头部点击记录
                datalist:[], 		//数据数组
                clickList:[], 		//点击情况记录
                clicklistshow:[],   //点击index记录
                cityvalue: '选择城市', 		//选择内容展示
            }
        },
        created(){
            this.get();
        },
        methods: {
            get(){
                u.get('/city_list', 0 , res => {
                    let _data = []
                    _data.push(res.data)
                    this.datalist = _data 
                })
            },
            getData (fatherindex=0,selectindex=0, item){
            // fatherindex 选择主类
            // code 传的对应参数
            // 本身第几个点击
            let _showul = false

            let _datalist = JSON.parse(JSON.stringify(this.datalist))
            let _clicklistshow = JSON.parse(JSON.stringify(this.clicklistshow))
            let _clickList = JSON.parse(JSON.stringify(this.clickList))

                _clicklistshow[fatherindex] = item.name   			//点击后名字列表
                _clickList[fatherindex] = selectindex   			//点击index列表

            let _titleclick = fatherindex
            let _titlelist = ['省份', '城市', '区县']
            let _city_value = ""

            let _splictitle = _titlelist.slice(0, fatherindex + 1)
            let _clicklistlength = _clickList.slice(0,fatherindex + 1)
            let _clicklength = _clicklistshow.slice(0,fatherindex + 1)

            for (let i = 0; i < _clicklength.length; i++) {
                if (i == _clicklength.length - 1) {
                    _city_value += _clicklength[i]
                }else {
                    let _add =  _clicklength[i] + "-"
                    _city_value += _add
                }
            }
            if (fatherindex < 2) {
                let _obj = {
                    'city_code':item.code
                }               				       	
                u.get('/city_list', _obj , res =>{
                    let _resdata = res.data	
                    if (_resdata.length > 0) {
                        _titleclick = fatherindex + 1
                        _datalist[fatherindex + 1] = _resdata
                        _splictitle = _titlelist.slice(0, fatherindex + 2)
                        _showul = true
                    }else{
                        this.$emit('backcode',item.code)
                    }
                    this.cityvalue = _city_value 
                    this.clicklistshow = _clicklistshow 
                    this.titleclick =  _titleclick
                    this.titlelist = _splictitle
                    this.clickList = _clicklistlength 
                    this.datalist =  _datalist
                    this.showul = _showul
                })
            }else{
                this.$emit('backcode',item.code)
                this.cityvalue = _city_value 
                this.clicklistshow = _clicklistshow 
                this.titleclick =  _titleclick
                this.titlelist = _splictitle
                this.clickList = _clicklistlength 
                this.datalist =  _datalist
                this.showul = _showul
            }
        },

        showUl (){
            this.showul = true
        },

        handleTitle(index){
            this.titleclick = index
        }
        }
    }
</script>

<style lang="less" scoped>
.city_select{
    position: relative;
    // padding-left: 10px;
    // width: e('calc(100% - 80px)');
    height: 40px;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    .city_value{
        position: absolute;
        height: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 10px;
        width: e('calc(100% - 10px)');
        font-size: 12px;
    }

    .city_img_bottom,.city_img_top{
        width: 20px;
        height: 20px;
        background-image: url('../../img/drop-arrow.png');
        position: absolute;
        right: 5px;
        top: 11px;
        background-position: -4px -17px;
    }

    .city_img_bottom{
        background-position: -4px -3px;
    }
    .city_list{
        position: absolute;
        top: 40px;
        width: 100%;
        z-index: 1;
        .ul{
            display: flex;
            flex-direction: row;
            width: 100%;
            flex-wrap: wrap;
            background: #FFFFFF;
            box-shadow: 0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.24);
            .li{
                font-size: 12px;
                color: #333333;
                letter-spacing: 0;
                padding: 5px;
                cursor: pointer;
            }
            .liclicked{
                color: #4A90E2;
                font-size: 12px;
                letter-spacing: 0;
                padding: 5px;
            }
        }
        .hidden{
            display: none;
        }
    }

    .city_title{
        width: 100%;
        height: 32px;
        background: #F0F0F0;
        border: 1px solid #D8D8D8;
        display: flex;
        flex-direction: row;
        vertical-align: middle;
        align-items: center;
        .city_title_list{
            width: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
        }
        .city_title_click{
            width: 70px;
            background: white;
            border: 1px solid #D8D8D8;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
        }
    }
    .hidden{
        display: none;
    }
}

</style>

