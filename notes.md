#React Notes:

###Required:
- Node.js
- React Dev Tools (Chrome Extension)
- Package: `react` (Highlighter for atom)
- Module Bundler - Webpack

To start:
- `npm start` to start autoreload or `npm run watch` to run everything concurrently
- Choose mounting point, e.g:  `render(<Root/>, document.querySelector('#main'));` means that `main` will be the mounting point.

###Components
- Reusable piece of your website
- Every Class needs a method
- Best practise is to separate each component into a new file (this will require the import of React at the start of every file).
- Use `className` to add classes
- Using Emmet: Ctrl + E on `form.store-selector` autocompletes the tag (HANDY!)
- Layout order in file:
    1. Constructor
    2. Life cycle hooks
    3. Custom methods
    4. Render function

###JSX
- Must only return one parent element
- Self-closing tags, e.g. `<img />`, `<hr />`, `<br />`
- To add a comment, `{ /* Hello */ }`
- **NOTE:** Do not put the comment on the top of what is about to be returned. Either put it outside the return, or inside the parent container.

###CSS in React
- Can be a different number of ways
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
- Convert to a Stateless Functional Component by saving it to a variable and passing through an argument to obtain any props set on component.
    ```
    // BEST PRACTISE
    const Header = (props) => {

    }
    ```

###Routing
Using react router - `import { BrowserRouter, Match, Miss } from 'react-router'`.
- **Match**: render components that match the pattern
- **Miss**: for any pages that don't follow a pattern, render component.
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
- Events are done inline:
    If the event has arguments that needs to get passed through: `<button onClick={(e) => {this.logout(e)}}>Logout</button>`.  
    If not, it can be written like this: `<button onClick={this.logout}>Logout</button>;` (if method is written within the component)
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
- By using `context`, this'll declare something at a top level, and make it available globally (resist from doing this as much as possible).  
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

####Setting up Firebase:
- Sign up to Firebase
- Add a new module to connect to Firebase
- In Firebase, go to `Overview` > `Add Firebase to your web app`. This will spit out config details, which can then be used to connect the app to Firebase

###React Lifecycle Hooks
React has a number of hooks that can be used to target instances before/after/during state change.   
Examples: `componentWillMount()` & `componentWillUnmount()`

###Localstorage
- Storing the data in the Browser
- Accessible in the browser through `Console` > `Application` > `Local Storage`
    ```
    // Setup:
    localStorage.setItem(key, value);

    // Fetch:
    localStorage.getItem(key);
    ```

###Bi-directional Data Flow and Live State Editing
In React, if you set a value on a form field, an `onChange()` method must be provided also.

###Removing Items from State
- Set value to `null` if item is linked to Firebase
- If not, delete can be used `delete order[key]`.

###Animations
- `import CSSTransitionGroup from 'react-addons-css-transition-group';`
- Example - this'll give the elements some classes that we can then hook into:
    ```
    <CSSTransitionGroup
        className="order"
        component="ul"
        transitionName="order"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
    </CSSTransitionGroup>
    ```

###Component Validation with PropTypes
- Allow us to validate the data that is coming through to the component's props
- Makes the component more resilient
- **Documentation**: https://facebook.github.io/react/docs/typechecking-with-proptypes.html
    ```
    // Specify that a string is required
    Header.propTypes = {
        tagline: React.PropTypes.string.isRequired
    }

    // Specify that a function is required
    AddFishForm.propTypes = {
        addFish: React.PropTypes.func.isRequired
    }
    ```

###Authentication
In Firebase:
1. Go to authentication
2. Enable chosen login avenues, e.g. Facebook
3. Create App within Social Dev Account
    Add the callback URL that Firebase provides
4. Grab the App ID and App Secret and add it into Firebase.

Setting it up in react using base authentication:
1. Add conditionals to the `render()` function
    ```
    // Check if they are not logged in at all
    if (!this.state.uid) {
        return <div>{this.renderLogin()}</div>
    }

    // check if they are the owner of the store
    if (this.state.uid !== this.state.owner) {
        return (
            <div>
                <p>Sorry you aren't the owner of this store.</p>
                {logout}
            </div>
        )
    }
    ```
2. Add `renderLogin()` options which bind to an authentication method.
    ```
    renderLogin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
                <button className="facebook" onClick={() => this.authenticate('facebook')}>Log In with Facebook</button>
                <button className="twitter" onClick={() => this.authenticate('twitter')}>Log In with Twitter</button>
            </nav>
        )
    }
    ```
3. Connect authentication to Firebase  
    Using Firebase's `authWithOAuthPopup()` method:
    ```
    authenticate(provider) {
        // console.log(`Trying to login with ${provider}`);
        base.authWithOAuthPopup(provider, this.authHandler);
    }
    ```
    Handle login states:
    ```
    authHandler(err, authData) {
        // console.log(authData);

        if (err) {
            console.error(err);
            return;
        }

        // Grab the store Info
        const storeRef = base.database().ref(this.props.storeId);

        // Query the firebase onece for the store data
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};

            // claim it as our own if there is no owner already
            if (!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                });
            }

            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });
        })
    }
    ```
4. Logout  
    Using Firebases `unauth()` method:
    ```
        logout() {
            base.unauth();
            this.setState({ uid: null })
        }
    ```
5. Securing the Data in Firebase: `Database` > `Rules`:
    ```
    {
        "rules": {
            // won't let people delete an existing room
            ".write": "!data.exists()",
            ".read": true,
            "$room" : {
              // only the store owner can edit the data
              ".write" : "newData.child('owner').val() === auth.uid",
              ".read" : true
            }
        }
    }
    ```

###Build React for Production
- `create-react-app` has a build script in the package manager.  
- Command to run: `npm run build` - compress, minify and remove stuff we don't need. Build files can be found in `/build`

####1. Deploying to now sh - [Now](https://zeit.co/now)
- Free open-source hosting
- Great use case for showing off your app/website in real time.
**Steps:**
1. Install globally in the terminal: `npm install -g now now-serve`
2. Create account / login: `now`. An email will be sent to authenticate token.
3. Run a build `npm run build` and go into folder `cd build`.
    Command to deploy single page app - `ns --cmd "list ./content -s"`.   
    **OR:**   
    This can be set up as a deployment script in `package.json` as `"deploy": "ns ./build --cmd \"list ./content -s\""`. To run deployment, `npm run deploy`.
4. Update Firebase authentication detail: `Authentication` > `Sign-in Method` > add `now.sh`

####2. Deploying to Github Pages
1. Create a repo in Github.
    Github starts there path from `github.io/[username]/[repo]/etc...`.  
    In order to get it to start the homepage from a diff point, we can add this to `package.json`:  
    `"homepage": "https://jenny-tran.github.io/catch-of-the-day"`

####3. Deploying to an Apache Server
