import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withNamespaces } from 'react-i18next';
import merge from 'lodash/merge';
import keys from 'lodash/keys';
import values from 'lodash/values';
const EntityLabels = require('../../constants/entities');


function mapStateToProps(state, ownProps) {
    const entities= state['entities'];

    const tokenEntity = entities[EntityLabels.token];
    const token = tokenEntity && values(tokenEntity) && values(tokenEntity)[0];
    return {
        token
    };
}

@connect(
    mapStateToProps
)

class PrivateRoute extends React.Component {
    render() {
        const { component: Component, components = {}, item = {}, token, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={(props) => {
                    if (item.title && !item.hiddenTitle) {
                        window.document.title = item.title;
                    }
                    if (keys(props.match.params).length > 0) {
                        keys(props.match.params).forEach(
                            (ele) => {
                                if (ele.indexOf('id') !== -1 || ele.indexOf('Id') !== -1) {
                                    const reg = /^[0-9]*$/;
                                    if (reg.test(props.match.params[ele])) {
                                        merge(props.match.params, {
                                            [ele]: parseInt(props.match.params[ele], 10),
                                        });
                                    }
                                }
                            }
                        );
                    }
                    return (
                        token
                            ? (
                            <Component {...props} components={components} />
                        )
                            : (
                            <Redirect
                                to={{
                                    pathname: '/login',
                                    // state: { from: props.location },
                                }}
                            />
                        )
                    );
                }}
            />
        );
    }
}

export default PrivateRoute;