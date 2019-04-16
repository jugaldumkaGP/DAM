import React,{Component} from "react";
import "/application/frontend/src/css/folderview.css";
import foldericon from "/application/frontend/src/foldericon.png";
import {Asset} from "/application/frontend/src/components/asset_helper"

export class FoldersComponents extends Component {

  constructor(props){
    super(props);

    this.state={
      id: "",
      result: [],
      parent: "",
      hover_id: "",
      test: props.match.params.id,
      checked: false,
      selected_all: false,
      folder_to_be_deleted: [],
      asset_to_be_deleted: [],
      refresh:""
    }
 
  }

  componentWillMount(){
    if (this.state.test == null) {
     this.showfolders();
    } else {
      this.clickedHere(this.state.test)
    }
  }

  componentDidUpdate(){
    window.onpopstate  = (e) => {
      if(this.state.id ==null){
       this.showfolders()
       this.props.history.location.pathname ="/folders";
       this.props.history.push(`${this.props.history.location.pathname}`);
      }
      else{
         this.clickedHere(this.state.id)
      }
     }
  }

  showfolders = () => {
    let storeURL = ('http://localhost:8000/folders/');
    fetch(storeURL).then(response => response.json()).then(response=> {
    this.setState(
      {
        id:"",
        parent:"",
        result:response
      });
    this.props.history.location.pathname ="/folders";
    this.props.history.push(`${this.props.history.location.pathname}`);
  
     })
  }

  clickedHere(id){
    
   let storeURL = (`http://localhost:8000/folders/?id=${id}`)

   if(this.props.history.location.pathname == '/folders') {
   this.props.history.push(`${this.props.history.location.pathname}/${id}`);
   }
   else {
    this.props.history.location.pathname ="/folders";
    this.props.history.push(`${this.props.history.location.pathname}/${id}`);
   }
  
    // console.log("test1",this.props.history.location)
    fetch(storeURL).then(response => response.json()).then(response => {
    
    this.setState(
      {
        result:response[0].child[0],
        parent:id,
        id:response[0].parent
      });
    }); 
   }

   delete(e,id,parent){
         e.preventDefault();
         let storeURL = (`http://localhost:8000/folders/?id=${id}`)

         if (parent == null){
               fetch(storeURL,{method:"delete"}).then(res => this.showfolders()); 
           }
         else{
             fetch(storeURL,{method:"delete"}).then(res =>this.clickedHere(parent));     
           }     
   
    }

    deletemultiple(folders,assets){

      let folder_params=  'id='+ folders[0];
      let asset_params= 'id='+ assets[0]; 

      folders.map((item,index) => (
        folder_params = folder_params + '&id='+item
       ))
      assets.map((item,index)=> (
        asset_params = asset_params + '&id=' + item
        ))
      let storeURL = "http://localhost:8000/folders/?"+ folder_params
      let assetURL = "http://localhost:8000/asset_management/asset/?"+ asset_params
     
     if (this.state.parent == ""){
           fetch(storeURL,{method:"delete"}).then(res => this.showfolders());  
           fetch(assetURL,{method:"delete"}).then(()=> this.forceUpdate())   
       }
     else{
         // fetch(storeURL,{method:"delete"}).then(this.clickedHere(this.state.parent))
         fetch(assetURL,{method:"delete"}).then(res => this.child.showassets())

       }
       this.setState(
      {
        folder_to_be_deleted: [],
        asset_to_be_deleted:[]
      });
      
    }

    edit(e,id,parent){
      e.preventDefault();
      let storeURL = ("http://localhost:8000/folders/")
      let newfoldername = prompt("Enter new folder name")

      let json = {
                      'name':newfoldername,
                      'id':id,
                      'parent':parent
                  }
        if (parent==null)
        {
           fetch(storeURL,{ method: "put",
                            body: JSON.stringify(json), 
                            headers: new Headers({'Content-Type': 'application/json'})
              }).then(res => this.showfolders()) 
        }

        else{
           fetch(storeURL,{ method: "put",
                             body: JSON.stringify(json), 
                             headers: new Headers({'Content-Type': 'application/json'})
              }).then(res => this.clickedHere(parent)) 
           }     
      }        

      addfolders = (id,parent) => {
          var foldername = prompt("Enter new folder name")
          var json = {
                        "name" : foldername,
                        "parent" : parent
                     }
          let storeURL = ('http://localhost:8000/folders/')
       
         if (parent == "")
          {
             fetch(storeURL,{ method: "post",
                              body: JSON.stringify(json), 
                              headers: new Headers({'Content-Type': 'application/json'})
                }).then(res => this.showfolders()) 
          }

          else{
              fetch(storeURL,{ method: "post",
                               body: JSON.stringify(json), 
                               headers: new Headers({'Content-Type': 'application/json'})
                }).then(res => this.clickedHere(parent))
           
         }
       }

      back = (parent) => {
          if(parent==null)
          {
             this.showfolders()
          }
          else{
            this.clickedHere(parent)
          }
      }

      showhover=(id) =>{
           this.setState(
              {
                hover_id:id
              }
            );
      }

      showhoverout=() =>{
             
           this.setState(
              {
                hover_id:""                
              }
            );
      }

      clickedOnCheckBox = param => event => {
        
        if(event.target.checked) {
          let deleting_id = this.state.folder_to_be_deleted;
          deleting_id.push(event.target.id)
          this.setState({
            folder_to_be_deleted: deleting_id,
        })

        }
        else {
          let filteredItems = this.state.folder_to_be_deleted.filter(item => !event.target.id.includes(item))
          this.setState({
            folder_to_be_deleted: filteredItems,  
           })
        }
       
      };

      checkedAllCheckBoxes = params => event => {
        
        if(event.target.checked) { 
          let deleting_id =[];
          this.state.result.map((item,index) => (
            deleting_id.push(item.id)
          ));
          this.setState({
           folder_to_be_deleted: deleting_id,
           selected_all: true,
        })

        }
        else {
          let deleting_id =[];
          this.setState({
            folder_to_be_deleted: deleting_id,
            selected_all: false,
        })
         
        }

      }
      assetProps(assets){
            this.setState({
            asset_to_be_deleted: assets,
        })

        
      }
     
render(){
  
    return(
          <div className="format">
              
               <div className="row row-top">
                 <div className="row">
                   <div className="col-md-2">
                    <input onClick={this.checkedAllCheckBoxes()} type="checkbox"></input>
                     {this.state.folder_to_be_deleted.length > 1 || this.state.asset_to_be_deleted.length > 1? <i className="far fa-trash-alt fa-lg deleteiconrow" onClick={() => this.deletemultiple(this.state.folder_to_be_deleted,this.state.asset_to_be_deleted)}></i> : null }
                   </div>
                    <div className="col-md-10">    
                        <button className="buttoncolor col-md-offset-8"><i className="fas fa-reply fa-2x" onClick={() => this.back(this.state.id)}></i></button> 
                        <button className="buttoncolor"> <i className="fas fa-folder-plus fa-2x" onClick={() => this.addfolders(this.state.id,this.state.parent)}></i> </button>                     
                    </div>  
                 </div>
               </div>  
        
               {this.state.result.map((data, idx) => {
                  return (
                     <div key={data.id}  className ="inner-format"> 
                   
                         <div className ="row rowhighlight" onMouseEnter={() =>this.showhover(data.id)} onMouseLeave={() =>this.showhoverout()}>
                           
                           
                            {this.state.selected_all ? 
                                            <input className="checkbox" checked = {true} type="checkbox"></input> 
                                            : 
                                            <input className="checkbox" id={data.id} onChange={this.clickedOnCheckBox(idx)} type="checkbox"></input>
                            }
                            
                            <div className="col-md-2" onClick={()=>this.clickedHere(data.id)}>                                         
                                <img src={foldericon} height="50" width="50" align="left"/>
                            </div>
                      
                             <div className="col-md-6 text" onClick={()=>this.clickedHere(data.id)}>
                                {data.name}
                             </div>
                                                     
                             {this.state.hover_id === data.id  ? 
                                <span>
                                    <button><i className="far fa-trash-alt fa-lg padding10" onClick={(e) => this.delete(e,data.id,data.parent)}></i></button>&nbsp;&nbsp;
                                    <button><i className="far fa-edit fa-lg padding10" onClick={(e) => this.edit(e,data.id,data.parent)}></i> </button>
                                </span> : <span> </span>
                              }                             
                          </div> 
                                        

                         </div>
                         );           
                 })}
 
        <Asset key1={this.state.parent} key2={this.state.selected_all} asset={(assets)=>this.assetProps(assets)} onRef= {ref => (this.child = ref)}/>
           
          </div>          
       
    )
 }
}
