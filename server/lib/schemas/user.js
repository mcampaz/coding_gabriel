const {
	GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLType,
  GraphQLSchema,
  GraphQLNonNull,
	GraphQLObjectType,
	GraphQLInputObjectType
} = require('graphql');

const bcrypt = require('bcrypt');

const UserType = require('../types/user');
const UserModel = require('../models/user');

const UserSchema = {
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			users: {
				type: GraphQLList(UserType),
				async resolve(root, args, context, info) {
					const users = await UserModel.find().exec()
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
				async resolve(root, args, context, info) {
					const user = await UserModel.findById(args.id).exec();
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
					},
					role: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				async resolve(root, args, context, info) {
					const salt = await bcrypt.genSalt(10);
					if (!salt) {
						throw new Error('Error generating salt')
					}

					const passEncript = await bcrypt.hash(args.password, salt);
					if (!passEncript) {
						throw new Error('Error encripting password')
					}
					args.password = passEncript;

					const newUserModel = await new UserModel(args);
					const newUser = await newUserModel.save();

					if (!newUser) {
						throw new Error('Error')
					}

					return newUser;
				}
			},
			updateUser: {
				type: UserType,
				args: {
					id: {
						name: '_id',
						type: GraphQLNonNull(GraphQLString)
					},
					name: {
						type: GraphQLString
					},
					lastname: {
						type: GraphQLString
					},
					email: {
						type: GraphQLString
          },
          password: {
						type: GraphQLString
					},
					role: {
						type: GraphQLString
					}
				},
				async resolve(root, args, context, info) {
					return UserModel.findByIdAndUpdate(args.id, { 
						name: args.name,
						lastname: args.lastname,
						email: args.email
					}, function (err) {
						if (err) return next(err);
					});
				}
			},
			removeUser: {
				type: UserType,
				args: {
					id: { type: new GraphQLNonNull(GraphQLString) }
				},
				async resolve(root, args, context, info) {
					const userToRemove = await UserModel.findByIdAndRemove(args.id).exec();
					if (!userToRemove) {
						throw new Error('Error')
					}

					return userToRemove;
				}
			},
			login: {
				type: UserType,
				args: {
					email: { type: GraphQLNonNull(GraphQLString) },
					password: { type: GraphQLNonNull(GraphQLString) }
				},
				async resolve(root, args, context, info) {
					const user = await UserModel.findOne({ email: args.email });
					if (!user) {
						throw new Error('There not any user with that email in our database')
					}

					const valid = await bcrypt.compare(args.password, user.password);
					if (!valid) {
						throw new Error('Invalid password')
					}

					return {
						id: user._id,
						name: user.name,
						lastname: user.lastname,
						email: user.email,
						role: user.role
					}
				}
			}
		}
	})
};

module.exports = new GraphQLSchema(UserSchema);
