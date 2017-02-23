#React Notes:

###Required:
- Node.js
- React Dev Tools (Chrome Extension)
- Package: `react` (Highlighter for atom)
- Module Bundler - Webpack

To start:
- `npm start`
- Choose mounting point, e.g:  `render(<Root/>, document.querySelector('#main'));` means that main will be the mounting point.

###Components
- Reusable piece of your website
- Every Class needs a method
- Best practise is to separate each component into a new file (this will require the import of React at the start of every file).
- Use `className` to add classes
- Using Emmet: Ctrl + E on `form.store-selector` autocompletes the tag (HANDY!)


###JSX
- Must only return one parent element
- Self-close tags, e.g. `<img />`, `<hr />`, `<br />`
- To add a comment, `{ /* Hello */ }`
- Do not put the comment on the top of what is about to be returned. Either put it outside the return, or inside the parent container.

###CSS in React
Can be a different number of ways
- Can just import the stylesheet as a whole - `import './css/style.css';`

###Getting Data to import into component
- Via props
- Using attributes will create props: e.g. `<Header age="500" cool="{true}" tagline="Fresh Seafood Market"/>`
- Setting up variable using curly brackets, eg. `{this.props.tagline}`
    - `this`: refers to the component
    - `props`: object that's available (to see the props available - `console.log(this)` inside the component)
    - `tagline`: refers to the attribute set
- Tip for debugging - Like `$0` to target elements in the console, you can use `$r` to target that component, e.g. `$r.props` or `$r.props.tagline`.

###Stateless Functional Components
- When the component only needs to render out HTML, i.e. you don't need other methods, it doesn't make sense to use a react component.
- Convert to a Stateless Functional Component, by saving it to a variable and passing through an argument to obtain any props set on component.
    ```
    // BEST PRACTISE
    const Header = (props) => {

    }
    ```

###Routing
Using react router - `import { BrowserRouter, Match, Miss } from 'react-router'`.
- Match: render components that match the pattern
- Miss: for any pages that don't follow a pattern, render component.
    ```
    const Root = () => {
        return (
            <BrowserRouter>
                <div>
                    <Match exactly pattern="/" component={StorePicker} />
                    <Match exactly pattern="/store/:storeId" component={App} />
                    <Miss component={NotFound} />
                </div>
            </BrowserRouter>
        )
    }
    ```

###Working with React Events
- Synthetic event works exactly the same as JS events.
- Events are done inline.
- Render binds to the Class that you're in.
- Function refs
    ```
    // When this input inside StorePicker is rendered, it'll put a ref to the Class
    <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref="{(input) => {this.storeInput = input}}"/>

    // This can then be referenced with $r.storeInput in the console.
    ```
When creating additional methods to components, these methods do not have access to `this`. To bind the methods to the Class:
- Use a constructor Function
    ```
    constructor() {
        super();
        this.goToStore = this.goToStore.bind(this);
    }
    ```
- Bind `this` to the `onSubmit()` attr `<form className="store-selector" onSubmit={this.goToStore.bind(this)}>`
- Use an arrow function `<form className="store-selector" onSubmit={(e) => {this.goToStore(e)}}>`

###React Router
- Surface the router in the method using context.
- By using context, this'll declare something at a top level, and make it available globally (resist from doing this as much as possible).
    ```
    StorePicker.contextTypes = {
        router: React.PropTypes.object
    }
    ```

###States
- Core fundamental concept
- Representation of data in the application
- Think of it as one object that holds all of the data
- Whenever you want anything to change, the state gets updated. Let React update the HTML
- State is tied to your app component
- Good practise to take a copy of your state, and then update your state.
    ```
    constructor() {
        super();

        // make addFish available to the Class
        this.addFish = this.addFish.bind(this);

        // getInitialState
        this.state = {
            fishes: {},
            order: {}
        }
    }
    addFish(fish) {
        // update our state
        const fishes = {...this.state.fishes};

        // add in new fish
        const timeStamp = Date.now();

        fishes[`fish-${timeStamp}`] = fish;

        // set state
        this.setState({ fishes })
    }
    ```
- Pass down states and make it accessible in the component:
    ```
    // Level 1 - pass down method via props:
    <Inventory addFish={this.addFish}/>

    // Level 2 - access method via props:
    <AddFishForm addFish={this.props.addFish} />
    ```

###Displaying state with JSX
- No loops in React. This is to be done using normal JS.
- When looping over objects, we can use `Object.keys()` to return an array, where we can then use `.map()`
- React requires unique keys in order to specify what component needs updating when something changes state.
    ```
    {Object.keys(this.state.fishes)
        .map(key => <Fish key={key} details={this.state.fishes[key]} />)}
    ```
- Clean up - use destructuring:
    ```
    // Instead of writing this:
    {this.props.details.name}

    // Destructuring:
    const { details } = this.props;

    // Target value:
    {details.name}
    ```

###Updating Order State
- Do not update the key attribute, create a duplicate instead.
    ```
    // Method for App
    addToOrder(key) {
        // take a copy of our state
        const order = {...this.state.order};

        // update or add the new number of fish ordered
        order[key] = order[key] + 1 || 1; // Either add one, or start at 1.

        this.setState({ order });
    }

    // Render in App:
    <ul className="list-of-fishes">
        {Object.keys(this.state.fishes)
            .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)}
    </ul>

    // Inside component:
    const { details, index } = this.props;
    <button disabled={!isAvailable} onClick={(key) => this.props.addToOrder(index)}>{buttonText}</button>    
    ```

    Above variables were destructured where `const { details, index } = this.props;` is the same as:
    ```
    const details = this.props.details;
    const index = this.props.index;
    ```

###Displaying Order State with JSX
In some instances, it's better to create a new method rather than creating a new component.
```
// THE METHOD:
renderOrder(key) {
    const fish = this.props.fishes[key];
    const count = this.props.order[key];

    if (!fish || fish.status === 'unavailable') {
        return <li key={key}>Sorry, {fish ? fish.name : 'fish'} no longer available!</li>
    }

    return (
        <li key={key}>
            <span>{count}lbs {fish.name}</span>
            <span className="price">{formatPrice(count * fish.price)}</span>
        </li>
    )
}

// THE CALL:
{orderIds.map(this.renderOrder)}
```

###Persisting our State with Firebase
In order to save the data even on page reload, a backend service is required.
Firebase is a product from Google:
- Uses websockets
- Syncs data to Firebase
- No matter how many people are editing at once, it'll sync from each computer.

Setup:
- Sign up to Firebase
- Add a new module to connect to Firebase
- In Firebase, go to `Overview` > `Add Firebase to your web app`. This will spit out config details, which can then be used to connect the app to Firebase

###React Lifecycle Hooks
React has a number of hooks that can be used to target instances before/after/during state change.   
Examples: `componentWillMount()` & `componentWillUnmount()`

###Localstorage
- Storing the data in the Browser
- Accessible in the browser through `Console` > `Application` > `Local Storage` > Domain
    ```
    // Setup:
    localStorage.setItem();

    // Fetch:
    localStorage.getItem();
    ```
