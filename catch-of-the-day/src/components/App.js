import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';


class App extends React.Component {
    constructor() {
        super();

        this.loadSamples = this.loadSamples.bind(this);

        this.addFish = this.addFish.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);

        this.addToOrder = this.addToOrder.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);

        // getInitialState
        this.state = {
            fishes: {},
            order: {}
        }
    }

    componentWillMount() {
        // This runs right before the <App> is rendered
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
            context: this,
            state: 'fishes'
        });

        // Check if there is any order in localStorage
        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

        if (localStorageRef) {
            // update our app components order state
            this.setState({
                order: JSON.parse(localStorageRef) // convert back into an object
            });
        }
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState) {
        // console.log({nextProps, nextState})
        localStorage.setItem(
            `order-${this.props.params.storeId}`,
            JSON.stringify(nextState.order)
        );
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

    updateFish(key, updatedFish) {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;

        this.setState({ fishes });
    }

    removeFish(key) {
        const fishes = {...this.state.fishes};

        fishes[key] = null;

        this.setState({ fishes });
    }

    loadSamples() {
        // set state
        this.setState({
            fishes: sampleFishes
        });
    }

    addToOrder(key) {
        // take a copy of our state
        const order = {...this.state.order};

        // update or add the new number of fish ordered
        order[key] = order[key] + 1 || 1;

        this.setState({ order });
    }

    removeFromOrder(key) {
        const order = {...this.state.order};

        delete order[key];

        this.setState({ order });
    }

    render () {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {Object.keys(this.state.fishes)
                            .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)}
                    </ul>
                </div>
                <Order
                    fishes={this.state.fishes}
                    order={this.state.order}
                    removeFromOrder={this.removeFromOrder}
                    params={this.props.params}/>
                <Inventory
                    addFish={this.addFish}
                    loadSamples={this.loadSamples}
                    fishes={this.state.fishes}
                    updateFish={this.updateFish}
                    removeFish={this.removeFish} />
            </div>
        )
    }
}

export default App;
