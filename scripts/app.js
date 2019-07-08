let storeModel, storeView, storeController;

window.onload = function() {
  storeModel = new StoreModel();
  storeModel.init(function(){
    storeView = new StoreView(storeModel);
    storeController = new StoreController(storeModel, storeView)
  })
}