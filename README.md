# Infinite Scroll View for Titanium

The constructor has two optional parameters: the options object for the Titanium Scroll View and the options for InfiniScroll

```javascript
var InfiniScroll = require('infini-scroll');
var myScrollView = new InfiniScroll({
  // Pass in any options you want your Ti.UI.ScrollView to have
  showVerticalScrollIndicator: true
}, {
  // trigger the scrollToEnd event at 82% of the way down
  triggerAt: '82%'

  // You could also specify triggerAt in device pixels from the bottom of the scroll view
  // triggerAt: '250dp'
  // Function to call when the event has occurredd
, onScrollToEnd: function(){
    fetchNewData(function(data){
      myScrollView.add(new MyDataView(data).view);
    });
  }
});

// Add the scroll view to your window
myWindow.add(myScrollView.view);
```

In the example above, myScrollView is an instance of the InfiniScroll class, not an instance of a UI element in Titanium. So you can access the scroll view by using ```myScrollView.view```.

Just add views to your InfiniScroll instance via ```myScrollView.add(myView)``` and it will re-adjust its events.