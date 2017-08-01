import Joi from 'joi';

const imageItem = Joi.object().keys({
  createdBy: Joi.string().hex().required(),
  url: Joi.string().required(),
  secure_url: Joi.string().required(),
  public_id: Joi.string().required(),
  version: Joi.string(),
  width: Joi.number(),
  height: Joi.number(),
  format: Joi.string().required(),
  created_at: Joi.date(),
  resource_type: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  bytes: Joi.number(),
  type: Joi.string(),
  etag: Joi.string(),
  signature: Joi.string(),
  original_filename: Joi.string()
});
const images = Joi.array().items(imageItem);
const updateMessage = Joi.object().keys({
  body: Joi.string(),
  image: imageItem,
  read: Joi.boolean()
});
const message = Joi.object().keys({
  body: Joi.string(),
  recipient: Joi.string().hex().required(),
  image: imageItem,
  createdAt: Joi.date(),
  createdBy: Joi.string().hex().required()
});
const participant = Joi.string().hex();

// const giphy = Joi.object().keys({

// });

export default {
  // POST /api/users
  createUser: {
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string(),
      facebook: Joi.object()
    }).or('password', 'facebook')
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      major: Joi.string().allow(''),
      mobileNumber: Joi.number(),
      residence: Joi.string(),
      graduationYear: Joi.string().allow(''),
      genderPronouns: Joi.array().items(Joi.string()),
      firstName: Joi.string(),
      lastName: Joi.string(),
      hometown: Joi.string().allow(''),
      bio: Joi.string().allow(''),
      currentProfile: imageItem,
      currentCover: imageItem,
      organizations: Joi.array().items(participant),
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },
  blockUser: {
    params: {
      userId: Joi.string().hex().required(),
      blockUserId: Joi.string().hex().required()
    }
  },
  // POST api/posts
  createPost: {
    body: {
      title: Joi.string(),
      details: Joi.string(),
      createdBy: Joi.string().required(),
      cover: images,
      authorResidence: Joi.string().required(),
      residentsFeed: Joi.boolean().required(),
      discoveryFeed: Joi.boolean().required(),
    }
  },
  createEvent: {
    body: {
      title: Joi.string().required(),
      details: Joi.string(),
      date: Joi.date().required(),
      time: Joi.date().required(),
      createdBy: Joi.string().required(),
      cover: images,
      location: Joi.string(),
      isEvent: Joi.boolean(),
      authorResidence: Joi.string().required(),
      residentsFeed: Joi.boolean().required(),
      discoveryFeed: Joi.boolean().required()
    }
  },
  // PUT api/posts/:postId
  updatePost: {
    body: {
      title: Joi.string(),
      details: Joi.string(),
      cover: images,
    },
    params: {
      postId: Joi.string().hex().required()
    }
  },
  libraryList: {
    params: {
      userId: Joi.string().hex().required()
    }
  },
  userEvents: {
    params: {
      userId: Joi.string().hex().required()
    }
  },
  // PUT api/posts/:postId
  getPost: {
    params: {
      postId: Joi.string().hex().required()
    }
  },
  updateEvent: {
    body: {
      title: Joi.string(),
      details: Joi.string(),
      date: Joi.date(),
      location: Joi.string(),
      time: Joi.date(),
      cover: images,
    },
    params: {
      eventId: Joi.string().hex().required()
    }
  },
  deleteEvent: {
    params: {
      eventId: Joi.string().hex().required()
    }
  },
  // DELETE api/posts/:postId
  removePost: {
    params: {
      postId: Joi.string().hex().required()
    }
  },
  likePost: {
    body: {
      actedAt: Joi.date(),
      actedBy: Joi.string().hex().required(),
      actionType: Joi.string().required()
    },
    params: {
      postId: Joi.string().hex().required(),
    }
  },
  unlikePost: {
    params: {
      postId: Joi.string().hex().required(),
      likeId: Joi.string().hex().required(),
    }
  },
  starPost: {
    body: {
      actedAt: Joi.date(),
      actedBy: Joi.string().hex().required(),
      actionType: Joi.string().required()
    },
    params: {
      postId: Joi.string().hex().required(),
    }
  },
  unstarPost: {
    params: {
      postId: Joi.string().hex().required(),
      starId: Joi.string().hex().required(),
    }
  },
  goingEvent: {
    body: {
      actedAt: Joi.date(),
      actedBy: Joi.string().hex().required(),
      actionType: Joi.string().required()
    },
    params: {
      eventId: Joi.string().hex().required(),
    }
  },
  deleteGoingEvent: {
    params: {
      eventId: Joi.string().hex().required(),
      goingId: Joi.string().hex().required(),
    }
  },
  likeCommentOnPost: {
    body: {
      actedAt: Joi.date(),
      actedBy: Joi.string().hex().required(),
      actionType: Joi.string().required()
    },
    params: {
      postId: Joi.string().hex().required(),
      commentId: Joi.string().hex().required(),
    }
  },
  unLikeCommentOnPost: {
    params: {
      postId: Joi.string().hex().required(),
      likeId: Joi.string().hex().required(),
      commentId: Joi.string().hex().required(),
    }
  },
  starCommentOnPost: {
    body: {
      actedAt: Joi.date(),
      actedBy: Joi.string().hex().required(),
      actionType: Joi.string().required()
    },
    params: {
      postId: Joi.string().hex().required(),
      commentId: Joi.string().hex().required(),
    }
  },
  unStarCommentOnPost: {
    params: {
      postId: Joi.string().hex().required(),
      starId: Joi.string().hex().required(),
      commentId: Joi.string().hex().required(),
    }
  },
  flagPost: {
    body: {
      actedAt: Joi.date(),
      actedBy: Joi.string().hex().required(),
      actionType: Joi.string().required()
    },
    params: {
      postId: Joi.string().hex().required(),
    }
  },
  unFlagPost: {
    params: {
      postId: Joi.string().hex().required(),
      flagId: Joi.string().hex().required(),
    }
  },
  flagCommentOnPost: {
    body: {
      actedAt: Joi.date(),
      actedBy: Joi.string().hex().required(),
      actionType: Joi.string().required()
    },
    params: {
      postId: Joi.string().hex().required(),
      commentId: Joi.string().hex().required(),
    }
  },
  unFlagCommentOnPost: {
    params: {
      postId: Joi.string().hex().required(),
      flagId: Joi.string().hex().required(),
      commentId: Joi.string().hex().required(),
    }
  },
  comment: {
    body: {
      body: Joi.string(),//.or('image').or('giphy'),
      createdBy: Joi.string().hex().required(),
      createdAt: Joi.date(),
      image: imageItem,
      giphy: Joi.object(),
    },
    params: {
      postId: Joi.string().hex().required(),
    }
  },
  updateComment: {
    body: {
      body: Joi.string(),//.or('image').or('giphy'),
      image: imageItem,
      giphy: Joi.object(),
    },
    params: {
      postId: Joi.string().hex().required(),
      commentId: Joi.string().hex().required()
    }
  },
  unComment: {
    params: {
      postId: Joi.string().hex().required(),
      commentId: Joi.string().hex().required()
    }
  },
  listByResidence: {
    params: {
      residence: Joi.string().required(),
    }
  },
  listByFeed: {
    params: {
      feed: Joi.string().required(),
      userId: Joi.string().hex().required()
    }
  },
  listByUser: {
    params: {
      userId: Joi.string().hex().required()
    }
  },
  getConversation: {
    params: {
      conversationId: Joi.string().hex().required()
    }
  },
  listConversations: {
    params: {
      userId: Joi.string().hex().required()
    }
  },
  leaveConversation: {
    params: {
      conversationId: Joi.string().hex().required(),
      userId: Joi.string().hex().required()
    }
  },
  removeConversation: {
    params: {
      conversationId: Joi.string().hex().required(),
      userId: Joi.string().hex().required()
    }
  },
  createConversation: {
    body: {
      messages: Joi.array().items(message).required(),
      participants: Joi.array().items(participant).required(),
      createdAt: Joi.date(),
      createdBy: Joi.string().hex().required(),
    }
  },
  updateConversation: {
    body: {
      message,
      participant,
      groupName: Joi.string(),
    },
    params: {
      conversationId: Joi.string().hex().required()
    }
  },
  updateMessage: {
    body: {
      updateMessage,
    },
    params: {
      conversationId: Joi.string().hex().required(),
      messageId: Joi.string().hex().required()
    }
  },
  removeMessage: {
    params: {
      conversationId: Joi.string().hex().required(),
      messageId: Joi.string().hex().required()
    }
  },
  getNotification: {
    params: {
      notificationId: Joi.string().hex().required()
    }
  },
  listNotifications: {
    params: {
      userId: Joi.string().hex().required()
    }
  },
  readNotifications: {
    params: {
      notificationId: Joi.string().hex().required(),
      userId: Joi.string().hex().required()
    }
  },
  unreadNotifications: {
    params: {
      userId: Joi.string().hex().required()
    }
  },
  removeNotification: {
    params: {
      notificationId: Joi.string().hex().required()
    }
  },
  createNotification: {
    body: {
      body: Joi.string().required(),
      recipient: Joi.string().hex().required(),
      actionTaken: Joi.string().required(),
      objectId: Joi.string().hex(),
      objectType: Joi.string(),
      read: Joi.boolean(),
      createdAt: Joi.date(),
      createdBy: Joi.string().hex().required(),
    }
  },
  updateNotification: {
    body: {
      read: Joi.boolean().required()
    },
    params: {
      notificationId: Joi.string().hex().required()
    }
  },
  addLibraryItem: {
    body: { library: imageItem },
  },
  removeLibraryItem: {
    params: {
      libraryId: Joi.string().hex().required(),
      postId: Joi.string().hex().required()
    }
  },
  deleteStandAloneLibraryItem: {
    params: {
      libraryId: Joi.string().hex().required(),
    }
  },
  // POST /api/auth/login
  login: {
    body: Joi.alternatives().try(
      Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
      }),
      Joi.object().keys({
        facebookId: Joi.string().required()
      })
    )
  },
  logout: {
    params: {
      userId: Joi.string().hex().required()
    }
  },
  getOrganization: {
    params: {
      name: Joi.string().required()
    }
  },
  postOrganization: {
    body: {
      name: Joi.string().required(),
      detail: Joi.string()
    }
  },
  userStatus: {
    params: {
      userId: Joi.string().hex().required()
    },
    body: {
      sataus: Joi.boolean().required()
    }
  }
};
