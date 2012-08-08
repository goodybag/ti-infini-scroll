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
  // Function to call when the event has occurredd
, onScrollToEnd: function(){
    fetchNewData(function(data){
      myScrollView.add(new MyDataView(data).view);
    });
  }
})
```

Just add views to your InfiniScroll instance via ```myScrollView.add(myView)``` and it will re-adjust its events.

## This is brand new

So, we haven't tested it out in Android quite yet. We'll get there.