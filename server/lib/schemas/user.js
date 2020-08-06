const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLObjectType
} = require('graphql');

const UserType = require('../types/user');
const UserModel = require('../models/user');

const UserSchema = {
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			users: {
				type: GraphQLList(UserType),
				resolve: () => {
					const users = UserModel.find().exec()
					if (!users) {
						throw new Error('Error')
					}
					return users
				}
			},
			userById: {
				type: UserType,
				args: {
					id: { type: GraphQLNonNull(GraphQLID) }
				},
				resolve: (root, params, context, info) => {
					const user = UserModel.findById(params.id).exec();
					if (!user) {
						throw new Error('Error')
					}
					return user
				}
			},
			userByEmail: {
				type: UserType,
				args: {
					email: { type: GraphQLNonNull(GraphQLString) }
				},
				resolve: (root, params, context, info) => {
					const user = UserModel.find({ 'email': params.id }).exec();
					if (!user) {
						throw new Error('Error')
					}
					return user
				}
			}
		}
	}),
	
	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: {
			addUser: {
				type: UserType,
				args: {
					name: {
						type: new GraphQLNonNull(GraphQLString)
					},
					lastname: {
						type: new GraphQLNonNull(GraphQLString)
					},
					email: {
						type: new GraphQLNonNull(GraphQLString)
          },
          password: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve: (root, params, context, info) => {
					const newUserModel = new UserModel(params);
					const newUser = newUserModel.save();
					if (!newUser) {
						throw new Error('Error')
					}
					return newUser
				}
			},
			updateUser: {
				type: UserType,
				args: {
					id: {
						name: '_id',
						type: new GraphQLNonNull(GraphQLString)
					},
					name: {
						type: new GraphQLNonNull(GraphQLString)
					},
					lastname: {
						type: new GraphQLNonNull(GraphQLString)
					},
					email: {
						type: new GraphQLNonNull(GraphQLString)
          },
          password: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve(root, params, context, info) {
					return UserModel.findByIdAndUpdate(params.id, { 
						name: params.name,
						lastname: params.lastname,
						email: params.email
					}, function (err) {
						if (err) return next(err);
					});
				}
			},
			removeUser: {
				type: UserType,
				args: {
					id: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve(root, params, context, info) {
					const userToRemove = UserModel.findByIdAndRemove(params.id).exec();
					if (!userToRemove) {
						throw new Error('Error')
					}
					return userToRemove;
				}
			}
		}
	})
};

module.exports = new GraphQLSchema(UserSchema);
