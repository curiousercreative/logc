# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: curiousercreative.com (MySQL 5.0.96-0ubuntu3)
# Database: logc
# Generation Time: 2014-02-13 23:43:55 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `videoId` int(11) default NULL,
  `userId` int(11) default NULL,
  `created` int(11) default NULL,
  `modified` int(11) default NULL,
  `rowId` int(11) default NULL,
  `note` text,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table likes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `likes`;

CREATE TABLE `likes` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `videoId` int(11) default NULL,
  `userId` int(11) default NULL,
  `created` int(11) default NULL,
  `rowId` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;

INSERT INTO `likes` (`id`, `videoId`, `userId`, `created`, `rowId`)
VALUES
	(5,55,1,1392155465,100),
	(2,55,1,1392155281,98),
	(3,55,1,1392155282,99),
	(4,55,1,1392155385,101),
	(6,55,1,1392156006,105),
	(7,55,1,1392156124,106),
	(8,55,1,1392156320,109),
	(9,55,1,1392156664,116),
	(10,55,1,1392157439,124),
	(11,55,1,1392158626,129),
	(12,55,1,1392158747,133),
	(13,55,1,1392158754,132),
	(14,55,1,1392158795,136),
	(16,55,1,1392159484,145),
	(17,55,1,1392159644,148),
	(18,55,1,1392160072,154),
	(19,55,1,1392160185,155),
	(20,55,1,1392160324,157),
	(21,55,1,1392160796,167),
	(22,55,1,1392160798,168),
	(23,55,1,1392160856,169),
	(24,55,1,1392161062,173),
	(25,55,1,1392161154,175),
	(26,55,1,1392161416,178),
	(27,55,1,1392161452,179),
	(28,55,1,1392161537,182),
	(29,55,1,1392161579,183),
	(30,55,1,1392161656,184),
	(32,55,1,1392161890,188),
	(33,55,1,1392161953,189),
	(34,55,1,1392161983,190),
	(35,55,1,1392162310,197),
	(37,55,1,1392162623,206),
	(38,55,1,1392162650,207);

/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rows
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rows`;

CREATE TABLE `rows` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `type` tinytext,
  `note` text,
  `timecode` float default NULL,
  `created` int(11) default NULL,
  `modified` int(11) default NULL,
  `videoId` int(11) default NULL,
  `createdBy` int(11) default NULL,
  `modifiedLastBy` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `rows` WRITE;
/*!40000 ALTER TABLE `rows` DISABLE KEYS */;

INSERT INTO `rows` (`id`, `type`, `note`, `timecode`, `created`, `modified`, `videoId`, `createdBy`, `modifiedLastBy`)
VALUES
	(3,'transcription','I\'m Michael Weinberg, Vice President at Public Knowledge. Public Knowledge is a non-profit, public interest advocacy group representing consumers in the public on tech policy issues.',28.5,1392052477,1392069231,55,1,1),
	(9,'transcription','so a lot of open network things like net neutrality and a lot of intelectual property things like copyright, patent, trademark.',39.5417,1392062474,1392070481,55,1,1),
	(10,'transcription','Q: Please introduce yourself and tell us where we are',23.7931,1392069385,1392069433,55,1,1),
	(11,'transcription','Q: Can you tell the uneducated public about 3d printing and personal manufacturing and why do we care about it?',47.8852,1392070506,1392070594,55,1,1),
	(12,'transcription','A 3d printer is just a machine that, you can download a file from the internet or you can build a file on a computer and it can turn that file into a physical object',70.3728,1392070613,1392070663,55,1,1),
	(13,'transcription','Usually, builds the object up layer by layer so you then have a physical thing that looks like what was designed on the screen.',81.7283,1392070724,1392070758,55,1,1),
	(14,'transcription','Personal manufacturing is bigger than 3d printing. 3d printing for a lot people is a gateway drug to personal manufacturing where there is a suite of tools that you can use',89.912,1392070760,1392070802,55,1,1),
	(15,'transcription','to design things digitally and then, or download off the internet things that other people have designed and then create them either in your home or in a small workshop.',101.643,1392070802,1392070836,55,1,1),
	(16,'transcription','you don\'t need a whole factory to start making these physical things.',110.516,1392070836,1392070849,55,1,1),
	(17,'transcription','Q: How is this different from other manufacturing technologies?',114.532,1392070849,1392070870,55,1,1),
	(18,'transcription','One of the differences is scale. You can do this and use these tools to make one off things very easily. The investment is getting lower and lower everyday',128.545,1392070870,1392070903,55,1,1),
	(19,'transcription','And so it opens up to a lot of people. Also, there\'s the precision because we\'ve had hand tools and even power tools at home',139.537,1392070903,1392070934,55,1,1),
	(20,'transcription','We\'re even one or two generations away from people having very sophisticated tools in their homes. But because these are digital tools, the barrier to entry to use things and create things becomes lower.',149.411,1392070935,1392070973,55,1,1),
	(21,'transcription','You can automate it, you can download your first thing off the internet. Maybe it\'ll come out well and maybe that convinces you to try and customize it a little',160.866,1392070973,1392071011,55,1,1),
	(22,'transcription','But it gives you this opportunity to start small and succeed earlier and potentially succeed early and then you can start thinking about how to build those multiple objects and manufacture for yourself however you want, whatever makes sense for you.',172.072,1392071011,1392071059,55,1,1),
	(23,'transcription','Q: You wrote a book called \"It will be awesome if they don\'t screw it up\". Tell us what will be awesome and why is this something that\'s exciting?',191.126,1392071059,1392071108,55,1,1),
	(24,'transcription','I mean, you see a technology like 3d printing and you see this incredible possibility of people really creating things, sharing things, building on the world around them in this really new and interesting way',207.932,1392071108,1392071143,55,1,1),
	(25,'transcription','So when we think of that sort of thing at an organization like Public Knowledge, we say to ourselves \"that\'s new and that\'s great, but it also feels very familiar\".',221.535,1392071143,1392071187,55,1,1),
	(26,'transcription','We\'ve seen technologies in the last 10 or 15, 20 years that have empowered people like that on the internet and one of the things that we think about when thinking of 3d printing:',233.571,1392071187,1392072130,55,1,1),
	(27,'transcription','what do we wish we had done 10 years ago, 15 years ago in the digital copyright space that would make our jobs today, all the SOPA/PIPA fights, everything else, make those jobs easier.',244,1392071258,1392071535,55,1,1),
	(28,'transcription','Because those are the ways that this potential to screw up the internet and all this digital copyright stuff. So we look forward and say, \"Ok, well there\'s all this potential for 3d printing, there\'s also this potential for people to screw it up.\"',258.855,1392071535,1392071613,55,1,1),
	(29,'transcription','For laws to be passed that make it harder to use or mandates or things like that where it just doesn\'t grow to it\'s full potential.',272.382,1392071613,1392071649,55,1,1),
	(30,'transcription','So a lot of the work that we\'re doing in conjunction with that, in connection with that is to try and lay groundwork today so if there are the kind of policy battles around 3d printing that we see around the internet 10 years from now, we\'re much better prepared because of the work that we\'re doing today.',279.475,1392071649,1392072940,55,1,1),
	(31,'transcription','And so when we talk about screwing it, it really is screwing it up from a policy, from a legal standpoint, making it harder to do all the things with 3d printing that you could do.',297,1392071720,1392072757,55,1,1),
	(32,'transcription','Q: Why is this something that is interesting for policymakers?',313.91,1392085085,1392085112,55,1,1),
	(33,'transcription','It\'s a general purpose technology, so it\'s had right now to say that 3d printing is definitely going to do this or definitely do that, it\'s very much of a technology of possibility.',323.607,1392085112,1392089377,55,1,1),
	(34,'transcription','But if you think about the kinds of policy problems it could raise, there are obvious ones. There are intellectual property questions.',336.153,1392085160,1392085187,55,1,1),
	(35,'transcription','3d printers create, they can copy, they can build upon things so it raises all these questions. So you can see all these overzealous responses to concerns about intellectual property infringements saying,Â ',343.861,1392085187,1392085275,55,1,1),
	(36,'transcription','\"Ok, we\'re going to limit what 3d printers can do. 3d printers can\'t make this type of thing, 3d printers need to call into a central database and get permission before they print something.\"',358.639,1392085275,1392089363,55,1,1),
	(37,'transcription','These technological limits, that would be a huge problem. We also see other areas of policy concern where, ok maybe we\'re worried about 3d printed firearms.',365.556,1392085353,1392089354,55,1,1),
	(38,'transcription','And so the same sort of limits will get built into 3d printers where they just can\'t make certain things.',378.406,1392085393,1392089352,55,1,1),
	(39,'transcription','The reality is, one of the lessons of the internet is, when you hobble a technology like that, either you hobble it and it becomes useless to everyone or',384.12,1392085421,1392085458,55,1,1),
	(40,'transcription','You hobble it in a way that it doesn\'t prevent people from doing the things you didn\'t want them to do. They figure out a workaround.',391.602,1392085458,1392089350,55,1,1),
	(41,'transcription','But, it prevents people who aren\'t engaged in that activity from doing something completely unrelated that you didn\'t see coming because you put up all these barriers that they don\'t know how to work around.',400.323,1392085488,1392089345,55,1,1),
	(42,'transcription','So it has this really negative effect on the ability of a new technology to really grow into itself if there artificial barriers that don\'t need to be there.',410.107,1392085531,1392089337,55,1,1),
	(43,'transcription','Q: Who is it and for what interest woud it be hobbled?',422.728,1392085564,1392085593,55,1,1),
	(44,'transcription','The reality is that right now, it\'s a lot of speculation. There is no one running around Capitol Hill saying, \"We need to outlaw 3d printers\".',436.5,1392085593,1392089286,55,1,1),
	(45,'transcription','So a huge amount of the work that we\'re doing is laying the groundwork to prepare for if that happens, we\'re prepared to push back.',447.303,1392085669,1392089279,55,1,1),
	(46,'transcription','Hopefull a lot of the work is wasted. I mean, we have an event 3d DC, we\'re going to do the third one pretty soon.',455.332,1392085701,1392089274,55,1,1),
	(47,'transcription','The idea is, come to Washington, show off your stuff, meet people in Washington, 3d printer community.',463.813,1392085739,1392085765,55,1,1),
	(48,'transcription','Not because there\'s something that has to happen now, but when and if there is a problem you can call those people and it\'s not the first time you\'re meeting them. It\'s the second, third, fourth you\'re having with them.',473.134,1392085765,1392089270,55,1,1),
	(49,'transcription','You can speculate, if someone is concerned about intellectual property infringement they\'re going to come and say we need to stop it',483.752,1392085816,1392089255,55,1,1),
	(50,'transcription','If someone\'s worried about guns they\'re going to same stop it. If someone\'s worried about product liability and all of a sudden all of these pieces are hurting someone, someone is going to come and potentially say',493.453,1392085844,1392089252,55,1,1),
	(51,'transcription','\"We have a concern, we need these limits on these printers\"',502.838,1392085920,1392089308,55,1,1),
	(52,'transcription','Q: Can you describe another technology or industry where these policy problems arose?',508.512,1392085940,1392085995,55,1,1),
	(53,'transcription','The classic example of someone responding to a new technology, the one that\'s in everyone\'s mind is how parts of the entertainment industry responded to the internet.',531.822,1392131070,1392131105,55,1,1),
	(54,'transcription','This technology came along, it was really general purpose. You could do all sorts of things with it. One of the things you could, it was easier to infringe copyright than it had been in the past.',541.772,1392131105,1392131164,55,1,1),
	(55,'transcription','So they came to congress and said, \"We need a bunch of laws that limit what could happen with computers and what could happen with the internet.\"',551.314,1392131165,1392131232,55,1,1),
	(56,'transcription','Their primary concern was limiting infringement, it wasn\'t necessarily with the collateral damage that was done on those technologies.',557.369,1392131232,1392131274,55,1,1),
	(57,'transcription','The groundwork we\'re doing today is so when the 3d printer equivalent of the music industry comes to congress and says, \"We\'re concerned about this, you should pass this law or this other law.\"',565.095,1392131274,1392131334,55,1,1),
	(58,'transcription','Congress doesn\'t say, \"I\'ve never heard of this 3d printing technology, and so there\'s no cost, let\'s just do it.\"',580.974,1392131334,1392131381,55,1,1),
	(59,'transcription','Instead they say, \"Oh no, we\'ve been talking to these people for years. We know all about the benefits.\"',586.542,1392131381,1392131416,55,1,1),
	(60,'transcription','If there\'s a problem, we can talk about the problem, but the assumption isn\'t that we can just shut it down and no one gets hurt.',589.9,1392131416,1392131455,55,1,1),
	(61,'transcription','Q: Is there an equivalent to the RIAA for manufacturing or another entity that\'s already concerned about 3d printing?',605.819,1392131468,1392131499,55,1,1),
	(62,'transcription','When you think about who the RIAA would be for 3d printing, it\'s hard to speculate right now.',619.278,1392131499,1392131519,55,1,1),
	(63,'transcription','Part of that is that it\'s hard to tell right now what widespread adoption of 3d printing looks like.',626.84,1392131519,1392131545,55,1,1),
	(64,'transcription','Is it everyone has a 3d printer? Is it there\'s one at a corner store like a Kinkos? Do you have virtual access to a 3d printer because someone has a big warehouse that\'s available to you on the internet?',632.212,1392131545,1392131593,55,1,1),
	(65,'transcription','It\'s hard to see what the use scenario is. The materials are evolving so quickly, right now if you think of the things that can be 3d printed easily, cheaply, at home: it\'s one category of the economy.',644.743,1392131594,1392131646,55,1,1),
	(66,'transcription','If you try to project 3 or 4 years in the future, the materials change, the technology changes. All of a sudden you\'ve lit up another category.',657.393,1392131647,1392131683,55,1,1),
	(67,'transcription','It\'s easy to speculate in the sense that you can pull just about anyone, but it\'s hard to speculate in a way that would necessarily be accurate, looking back on it.',666.266,1392131684,1392131722,55,1,1),
	(68,'transcription','Q: That seems to speak to how disruptive a technology this is...',677.38,1392131723,1392131756,55,1,1),
	(69,'transcription','Yeah, it\'s a lot of potential. 3d printing right now is all about potential.',689.151,1392131756,1392131775,55,1,1),
	(70,'transcription','We have all of these use scenarios that have been around for 20 years, that are actually very interesting, but we know about them.',694.662,1392131775,1392131844,55,1,1),
	(71,'transcription','Then, we\'re in this weird situation we\'re in now where it\'s breaking through the mainstream.',698.278,1392131835,1392131868,55,1,1),
	(72,'transcription','It\'s getting cheaper, it\'s getting faster, it\'s getting more available.',704.823,1392131868,1392131889,55,1,1),
	(73,'transcription','The question is: what do people do who are outside the traditional areas of 3d printing when they finally get access to it?',706.963,1392131890,1392131923,55,1,1),
	(74,'transcription','Everyday, every week, there is a new story about some random corner of the economy or society where someone says, \"Well, oh, 3d printing, that\'s going solve this problem that maybe I didn\'t even know was a problem before today. But when I saw this solution of a 3d printer, I said this is a problem and now I have the solution and I\'m going to deal with it.\"',715.241,1392131924,1392132012,55,1,1),
	(75,'transcription','Q: As you were saying it\'s cheaper and more available, I noticed you have a 3d printer in your office',740.014,1392132045,1392132064,55,1,1),
	(76,'transcription','Yeah, we have two!',743.377,1392132068,1392132075,55,1,1),
	(77,'transcription','Q: You have two 3d printers, what do you use them for?',745.803,1392132078,1392132090,55,1,1),
	(78,'transcription','We use them for a couple things. Obviously we use them for advocacy. A big part of having them is bringing them in, showing them to members of congress.',747.884,1392132093,1392132125,55,1,1),
	(79,'transcription','Sometimes we\'ll print their congressional district or some sort of token of where they\'re from so they can get a sense of it.',757.414,1392132125,1392132151,55,1,1),
	(80,'transcription','But the, because it\'s here, people use it for all sorts of random things.',763.515,1392132151,1392132179,55,1,1),
	(81,'transcription','My wife has a bass guitar and the jack on the bottom broke. So what do we do? We design another piece and we printed it out and we fixed it.',767.878,1392132179,1392132210,55,1,1),
	(82,'transcription','I had this problem with my dishwasher and it turned out that after so many hours and days of various repair people, we had just moved into this house. There was this hidden light switch that had been thrown, so there was no power going to it.',776.067,1392132212,1392132287,55,1,1),
	(83,'transcription','What did I do? I said, \"There must be a solution to this.\" I went online and of course the first thing I found was someone had designed a cover for my light switch so that no one would accidentally turn it off.',794.906,1392132287,1392132364,55,1,1),
	(84,'transcription','Which is totally mundane, but for the fact that I spent all of this time and money having various repair people coming and saying, \"No, everything is fine. I don\'t know what\'s wrong with it.\"',804.806,1392132364,1392132406,55,1,1),
	(85,'transcription','It ends up being used for all sorts of weird things. We had an intern who designed this great thing to give his girlfriend.',812.815,1392132408,1392132442,55,1,1),
	(86,'transcription','People just use it because it\'s around, once they figure out how to do the design. The design can be hard and there\'s a learning curve there.',821.688,1392132442,1392132482,55,1,1),
	(87,'transcription','Once they figure it out, it\'s a solution to their problems. Not all of them, but some of them.',829.346,1392132482,1392132508,55,1,1),
	(88,'transcription','Q: Does Public Knowledge have a motto/slogan that has to do with creativity or innovation?',842.674,1392132509,1392132532,55,1,1),
	(89,'transcription','We have an ever evolving tagline that I cannot pull out',838.517,1392132533,1392132547,55,1,1),
	(90,'transcription','Q: It seems like the sort of thing that is inspiring and enabling of creativity...',851.25,1392132548,1392132596,55,1,1),
	(91,'transcription','Oh yeah! People, when they first see it, the first thing they ask is, \"Can it make me pizza?\" or something like that.',864.527,1392132597,1392132630,55,1,1),
	(92,'transcription','But once you walk through the capability, the first thing that happens when people see a 3d printer is they start saying, \"Oh well, I\'ve had this thing that I wanted to make, but it\'s just for me, it\'s just for this one weird thing that I want to do. Can I do it with that?\"',872.294,1392132630,1392132691,55,1,1),
	(93,'transcription','Each one of them feels very mundane, except for that person who has that need and when you talk to enough people, they all have different random needs and collectively they make up the market for 3d printing.',887.453,1392132693,1392132739,55,1,1),
	(94,'transcription','It\'s very interesting to watch as people see it in the office.',901.616,1392132740,1392132751,55,1,1),
	(95,'transcription','Q: Your website says, \"Promotes creativity through balanced copyright policy....\"',909.347,1392132753,1392132801,55,1,1),
	(96,'log','Smile and laughter',921.468,1392132811,1392132819,55,1,1),
	(97,'transcription','Q: What are some other developments that support this mission that PK is fighting for?',934.218,1392132853,1392132894,55,1,1),
	(98,'transcription','The world of that is vast. Obviously you have this whole...',959.714,1392132894,1392155274,55,1,1),
	(102,'transcription','In addition, you\'re talking about things like copyright reform that makes it easy and balancing copyright to make sure that, yes we respect intelectual property, but there\'s also plenty of space for people to try new things and design new things and do interesting things.',993.473,1392155489,1392155565,55,1,1),
	(99,'transcription','We spend a lot of time worrying about net neutrality and the open internet because one of the reasons that we\'ve seen all this development with 3d printing is there\'s a community of people who are knit together, they\'re all over the world, they\'re working on things 24 hours a day.',962.259,1392155276,1392155281,55,1,1),
	(100,'transcription','They\'re communicating on top of the open internet. One of the reasons, people say, \"Why is 3d printing exploding now?\"',977.146,1392155303,1392155352,55,1,1),
	(101,'transcription','There are a lot of reasons for it, but one of the reasons is that the 3d printing community now has the internet. That is the network that they are building everything upon.',984.633,1392155352,1392155385,55,1,1),
	(103,'transcription','And websites that crop up that allow people to share the designs that they are creating for 3d printers, that those don\'t get taken down immediately because someone is concerned somewhere that they could also be used for copyright infringement.',1007.59,1392155572,1392155635,55,1,1),
	(104,'transcription','Same sort of thing with patent infringement. Patents are important, patents are useful but we have to make sure the system works for both patent holders and targets for things like patent trolls. Making sure there\'s a system where the balance is struck is correct.',1021.69,1392155636,1392155928,55,1,1),
	(105,'transcription','When you talk more emerging technologies, obviously you\'re talking about 3d printing. You\'re talking about personal manufacturing. You\'re talking about things like open source hardware.',1038.8,1392155955,1392156004,55,1,1),
	(106,'transcription','Where we\'re seeing this bridge from the open source software world and this maker world come together for open source software, because of this combination of tools and technologies, people are creating THINGS and new hardware projects in a way that was impossible a couple of years ago.',1048.22,1392156007,1392156124,55,1,1),
	(107,'transcription','You just didn\'t see the ability to say, \"I, the person that does not own a giant factory, a giant foundry, does not have access to these things...\"',1067.79,1392156124,1392156247,55,1,1),
	(108,'transcription','\"I\'m going to design a hardware project from scratch and it will become totally viable because I\'ll design it, I\'ll prototype it, I\'ll make sure it works, I\'ll go to Kickstarter and find a way to fund it, I\'ll find a factory to scale up from my 10 or 100 to a 1000 or 10000.\"',1076.05,1392156253,1392156273,55,1,1),
	(109,'transcription','Now, all of a sudden, we have people creating these physical things in a way that they were doing with software five years ago, but definitely not with hardware five years ago.',1092.95,1392156274,1392156319,55,1,1),
	(110,'transcription','Q: That\'s perfect, that transformation from digital to physical is the heart of this project',1104.8,1392156358,1392156377,55,1,1),
	(111,'transcription','It\'s super fascinating.',1113.6,1392156387,1392156396,55,1,1),
	(112,'log','--- Break ----',1116.16,1392156397,1392156435,55,1,1),
	(113,'transcription','Am I too relaxed looking? Sitting back in this chair?',1155.69,1392156505,1392156521,55,1,1),
	(114,'log','Smiles, laughter',1160.85,1392156523,1392156529,55,1,1),
	(115,'transcription','Q: There seems to be a larger transformation, a shift of power from a few large producers to a growing number of smaller makers, does that seem accurate to you?',1172.42,1392156544,1392156623,55,1,1),
	(116,'transcription','What we\'re seeing, at least in part, is the shift towards end-users, consumers being able to do more.',1217.62,1392156631,1392156663,55,1,1),
	(117,'transcription','That doesn\'t mean necessarily that they\'re going to stop buying things from large manufacturers or we\'re going to have these empty factories dotting the landscape.',1224.29,1392156666,1392156697,55,1,1),
	(118,'transcription','You\'re just going to see a different diversity of ways to manufacture.',1233.23,1392156698,1392156720,55,1,1),
	(119,'transcription','One of the things that happens when you see that is it builds on itself.',1236.58,1392156720,1392157605,55,1,1),
	(120,'transcription','Once you start seeing the world and you say, \"I built something like that. I understand how that works and I can fix it.\"',1253.21,1392156795,1392156860,55,1,1),
	(121,'transcription','If you\'re someone who, you just operate in mainstream culture and you say, \"I go to the store to buy this and I go to the store to buy this and they\'re all made in faraway places, I don\'t care where they came from.\"',1242.07,1392156739,1392156862,55,1,1),
	(122,'transcription','It starts to build on itself because you start to say to yourself, \"I know that\'s the thing that\'s available from the store but if it was a little different, it\'d be a little better and actually I know how to make it different. I know how to make it a little bit better.\"',1261.83,1392156864,1392156936,55,1,1),
	(123,'transcription','You start moving into this space where all these things that you don\'t even realize that you\'ve been settling with, you say, \"This works well enough.\"',1275.12,1392156910,1392156987,55,1,1),
	(124,'transcription','All of a sudden you start to say, \"Yeah, it works well enough, but I know how to make it work perfectly for me. I know how to make it work better.\"',1287.42,1392156988,1392157432,55,1,1),
	(125,'transcription','It just builds and builds because once you do that with one set of things, you do it with more and more.',1294.64,1392157025,1392157047,55,1,1),
	(126,'transcription','This isn\'t necessarily a new idea. There are people who have been fixing electronics since the beginning of electronics.',1300.34,1392157615,1392157655,55,1,1),
	(127,'transcription','But there are people who say, \"I\'m going to buy that shirt, I\'m going to buy that dress, I\'m going to buy those pants. I\'m going to buy them and they\'re kind of close enough, but because I know how to, I know how to sew, I know how to modify them. I\'m going to make them fantastic for me.\"',1307.11,1392157655,1392157731,55,1,1),
	(128,'transcription','What we\'re seeing is, with all these components getting cheaper and easier to use, you\'re seeing it happen in electronics.',1319.64,1392157733,1392157762,55,1,1),
	(129,'transcription','So now, you don\'t need to be an electrical engineer to start building really interesting, powerful electronics.',1328.33,1392157762,1392157798,55,1,1),
	(130,'transcription','You\'re well beyond the sort of, crystal radio stage where yes, it\'s fun and it\'s a great gateway but when you really want to do fantastic things you need to be a very sophisticated engineer.',1334.01,1392157798,1392157885,55,1,1),
	(131,'transcription','Your level of sophistication to do more interesting, kind of great things, has started to drop.',1347.4,1392157886,1392157913,55,1,1),
	(132,'transcription','I\'m someone who is not that sophisticated but because of the tools that are available to me, I can do really amazing things.',1354.01,1392157913,1392158681,55,1,1),
	(133,'transcription','As that return on low sophistication, high awesomeness keeps going up, that creates this cycle that says, \"I wanna keep doing these things, so maybe I\'ll learn a little bit more,\" and a huge new universe opens up to me without having to have access to all those giant factories anymore.',1360.69,1392158683,1392158744,55,1,1),
	(134,'transcription','Q: I love your use of the technical term awesomeness',1378.84,1392158764,1392158774,55,1,1),
	(135,'log','laughter, smiles',1378.84,1392158775,1392158783,55,1,1),
	(136,'transcription','I am a lawyer',1380.54,1392158787,1392162909,55,1,1),
	(137,'transcription','Q: Tell us more about Public Knowledge and copyright and intellectual property issues.',1420.21,1392158843,1392158884,55,1,1),
	(138,'transcription','Public Knowledge does a lot of work in copyright in part because copyright governs expression and creativity.',1426.2,1392158888,1392158922,55,1,1),
	(139,'transcription','It\'s really important if you\'re going to have a law that governs that, that it is really balanced and it really works for people.',1433.69,1392158924,1392158950,55,1,1),
	(140,'transcription','There\'s an important role for a copyright, but just as much as it can build people up, it can knock people down. It can be used to suppress creativity.Â Finding that balance is really critical',1441.31,1392158950,1392159172,55,1,1),
	(141,'transcription','In addition to that, we\'re in this world where things are built on top of computers and one of the things that computers do is they copy things.',1452.12,1392159188,1392159217,55,1,1),
	(142,'transcription','As a result of that, copyright law starts to creep into all sorts of sectors of society that it was never really designed to be part of.',1461.18,1392159217,1392159266,55,1,1),
	(143,'transcription','When that happens, the balance becomes that much more important because not only do you have a law that\'s touching on expression and creativity, all of a sudden it\'s a way to control all sorts of different parts of the world that are really not designed to be touched by copyright.',1469.63,1392159266,1392159341,55,1,1),
	(144,'transcription','Q: Can you draw the line between someone modified a pair of pants for their own use and walk us down the line to where it\'s copyright infringement',1483.94,1392159342,1392159454,55,1,1),
	(145,'transcription','This is one of the things that I really like about 3d printing when I think about it as a copyright advocate.',1531.05,1392159454,1392159484,55,1,1),
	(146,'transcription','One of the things we have learned as a society over the last ten years is we deal with the world increasingly through these computer screens and historically the kinds of things you see on that computer screen happened to be protected by copyright.',1538.96,1392159485,1392159542,55,1,1),
	(147,'transcription','What do you have on a computer? You\'ve got documents, you\'ve got photos, you\'ve got movies, you\'ve got articles. Those happen to be the types of things that are protected by copyright.',1554.2,1392159544,1392159584,55,1,1),
	(148,'transcription','What you don\'t realize, because you\'re just looking at that screen and everything on the screen is protected by copyright is that everything in the world isn\'t protected by copyright.',1562.41,1392159585,1392159641,55,1,1),
	(149,'transcription','When you step away from the screen and you look around at the real world, all of a sudden you say, \"That copyright thing that totally dominated my screen life, my online life, my computer life..\"Â In the real world it\'s still important, but it\'s not central.',1575.51,1392159645,1392159737,55,1,1),
	(150,'transcription','When I\'m thinking about, \"What about modifying clothes or something like that? What do you deal with, what\'s the copyright ramifications of something like that?\"',1592.49,1392159754,1392159795,55,1,1),
	(151,'transcription','Good news, clothes are not protectable by copyright. You can modify clothes to your heart\'s content and you\'re not worried about copyright infringement.',1599.79,1392159796,1392159854,55,1,1),
	(152,'transcription','You might think to yourself if you\'re coming from a digital space, \"I have a thing and I\'m modifying it, so it must be a copyright something so let\'s do a fair use analysis or something like that.\"',1609.81,1392159839,1392159933,55,1,1),
	(153,'transcription','Instead, you say, \"I don\'t need anyone\'s permission to modify my clothes.\" That\'s not a loophole in copyright law. That\'s just the way copyright law works which is it doesn\'t deal with functional objects.',1618.78,1392159934,1392159995,55,1,1),
	(154,'transcription','When you\'re talking about dealing with the real world, you\'re going to be dealing with things that are protected by copyright. There\'s all sorts of non-functional, creative, real world things that are protected by copyright.',1633,1392159997,1392160066,55,1,1),
	(155,'transcription','When you get into this digital/physical world where you see everything around you, the world of copyright becomes much less important and you start to see all these things that are freely available for you to build upon, to improve, to remix, to do whatever you want with because there\'s no IP owner and that feels crazy if you\'ve been paying attention to the internet for the past ten or fifteen years.',1642.6,1392160067,1392160183,55,1,1),
	(156,'transcription','If you went back 30 years and told someone about that, they\'d say, \"Of course I don\'t need permission. I don\'t need permission if I have a bookshelf to modify it. I don\'t need permission if I have shoes and I want to resole them or spray paint them orange.\"',1669.63,1392160183,1392160246,55,1,1),
	(157,'transcription','Because of the last ten or fifteen years of sort of permission, everything is protected by copyright, it really has warped the way we see the world and 3d printing and these digital manufacturing technologies give you the chance to step back and put it all into perspective.',1682.09,1392160246,1392160322,55,1,1),
	(158,'transcription','Q: Does the same hold true if I want to alter my pants and sell them commercially?',1701.74,1392160328,1392160345,55,1,1),
	(159,'transcription','Yeah, if something is protected by copyright, you have to worry about copyright. If something is protected by a patent, you need to worry about patent.',1703.53,1392160355,1392160396,55,1,1),
	(160,'transcription','All these things are very real. But, if there\'s no IP protection, you don\'t have to worry about IP protection.',1712.87,1392160396,1392160420,55,1,1),
	(161,'transcription','Beyond that, in the physical world and hopefully in the digital world, but in the physical world we have these doctrines, these first sale doctrines.',1720.13,1392160420,1392160478,55,1,1),
	(162,'transcription','When you buy a book, book, totally protected by copyright. But the copy that you have, that copy is yours. You can resell that to whoever you want. You could chop out a third of the pages, you could modify it and sell it whoever you want.',1727.37,1392160485,1392160567,55,1,1),
	(163,'transcription','That feels very weird in a digital space and it raises problems in a digital space, but in a physical space you\'re all of a sudden empowered over your objects.',1743,1392160568,1392160610,55,1,1),
	(164,'log','smile laughter',1753.65,1392160640,1392160646,55,1,1),
	(165,'transcription','You stumbled on a thing...',1754.21,1392160610,1392160650,55,1,1),
	(166,'transcription','Q: What objects do get copyrighted and then tell us the story of how we got to the point where we ask ourselves whose permission we need to modify things?',1761.46,1392160661,1392160712,55,1,1),
	(167,'transcription','When you\'re thinking about the line between copyright and patent and no protection: copyright and patent are the two large universes of intellectual property protection.',1786.75,1392160713,1392160755,55,1,1),
	(168,'transcription','If you want to be general about it, copyright protects things that are creative, that are expressive, that you\'d hire an artist or be an artist to make.',1798.05,1392160755,1392160792,55,1,1),
	(169,'transcription','Patents cover useful objects. The kinds of things that do things, that accomplish a task, not to just look nice or make you happy. Those are the things that you\'d have an engineer make.',1806.83,1392160809,1392160855,55,1,1),
	(170,'transcription','Phone: engineer. iPad: engineer. These are all protected by all sorts of different patents.',1819.95,1392160857,1392160901,55,1,1),
	(171,'transcription','In the world of copyright, copyright is different from patent in a lot of important ways. One of the ways that it\'s different is that it attaches automatically.',1827.41,1392160902,1392160941,55,1,1),
	(172,'transcription','The second that you make a creative thing, it\'s protected by copyright. There are reasons to register it, but you don\'t need to register it for protection.',1835.2,1392160942,1392160987,55,1,1),
	(173,'transcription','The protection lasts for the entire lifetime of the creator plus 70 years. There are all sorts of things that are just protected by copyright because they\'re protected automatically and the protection lasts a really long time.',1843.35,1392160988,1392161060,55,1,1),
	(174,'transcription','On the patent side, you have to apply for a patent, you have to get a patent which therefore all sorts of things that are patentable in the sense that they are useful, never go through that process for all sorts of reasons.',1857.44,1392161063,1392161108,55,1,1),
	(175,'transcription','If they make it through that process then that protection lasts for 20 years. 20 years is a long time, but 20 years is nothing compared to lifetime plus 70.',1870.2,1392161118,1392161154,55,1,1),
	(176,'transcription','You have this world of functional objects around you that are either expired patent or were never applied for patent or tried to get a patent or didn\'t get it.',1879.69,1392161155,1392161240,55,1,1),
	(177,'transcription','There\'s plenty of things that are protected by patent in the real world. This camera is protected by a patent, all of these devices, they\'re all protected by patent.',1890.63,1392161254,1392161278,55,1,1),
	(178,'transcription','One way to think about it is if you think back to when you were a little kid. You\'re sitting on the floor, Saturday morning, you\'re watching Saturday morning cartoons on your TV. Cartoons: copyrightable. Will be protected by copyright until after you are dead. TV: patentable. All of the patents in your television from when you were six years old have expired.',1898.54,1392161279,1392162939,55,1,1),
	(179,'transcription','You could recreate that TV without getting permission from anyone. You will not be able to recreate those cartoons without worrying about copyright.',1922.75,1392161417,1392161452,55,1,1),
	(180,'transcription','What was the second part of the question? Real quick',1934.06,1392161458,1392161480,55,1,1),
	(181,'transcription','Q: How did we get to the point of needing permission?',1934.06,1392161466,1392161509,55,1,1),
	(182,'transcription','Basically, what happened is the means of reproducing copyrighted objects came to everyone through computers.',1950.34,1392161510,1392161536,55,1,1),
	(183,'transcription','30 years ago you had, if you didn\'t have a bookbinding machine or a Xerox machine in your house, you are not going to easily be reproducing copyrighted works.',1959.8,1392161537,1392161579,55,1,1),
	(184,'transcription','Then we saw things like VCRs, we saw things like tapes, CDs eventually, computers. All of these make it very easy to copy and copy things protected by copyright.',1968.76,1392161580,1392161625,55,1,1),
	(185,'transcription','All of a sudden, people were engaged in copyright activities in a way that they just weren\'t before.',1980.36,1392161626,1392161655,55,1,1),
	(186,'transcription','All these technologies that allow you to copy and reproduce and distribute digitally, they all trigger copyright questions in a way that 30 years ago, you just didn\'t, it wasn\'t easy to do so you didn\'t have to worry about it.Â You weren\'t going to stumble upon a copyright problem.',1988.23,1392161660,1392161777,55,1,1),
	(187,'transcription','Q: But the laws have been in effect for a long time',2003.28,1392161783,1392161802,55,1,1),
	(188,'transcription','The last big rewrite of copyright law was passed in 1976 and the last substantive change was part of the Digital Millennium Copyright Act where the term was extended from life plus 50 to life plus 70 and that was in 1998.',2012.9,1392161802,1392161886,55,1,1),
	(189,'transcription','The concept of copyright goes back, you can trace it back to England. The issue is, the number of things protected by copyright have increased and the ease with which you can copy something unintentionally, non-commercially has gone up incredibly.',2027.34,1392161886,1392161953,55,1,1),
	(190,'transcription','Now, copyright was once a limited doctrine that only a couple people cared about and now we\'re in a world where everyone needs to worry about copyright.',2043.67,1392161954,1392161983,55,1,1),
	(191,'log','Holding the biz card (there\'s more in the master/online files that got trimmed in this offline)',2058.02,1392161993,1392162030,55,1,1),
	(192,'log','Following Michael into office, meeting his office mate.',2064.96,1392162042,1392162057,55,1,1),
	(193,'log','MED Michael shows his mini 3d printer',2090.4,1392162084,1392162096,55,1,1),
	(194,'log','MED mini printer assembled',2126.94,1392162130,1392162139,55,1,1),
	(195,'log','MED talking with hands',2144.59,1392162152,1392162185,55,1,1),
	(196,'log','MCU of 3d printed prosthetic hand',2251.43,1392162258,1392162283,55,1,1),
	(197,'log','MED demonstrating the hand',2274.74,1392162302,1392162309,55,1,1),
	(198,'log','MED two hands',2288.82,1392162316,1392162324,55,1,1),
	(210,'log','this is a test',0,1392329458,1392329461,55,3,3),
	(200,'log','(no audio in master/online clips either for b-roll)',2064.96,1392162369,1392232250,55,1,1),
	(201,'log','MCU hand interaction',2346.24,1392162455,1392162465,55,1,1),
	(202,'log','MCU weird colorful 3d printed thing',2354.56,1392162474,1392162485,55,1,1),
	(203,'log','MCU funny cat thing',2379.93,1392162502,1392162516,55,1,1),
	(204,'log','various metal 3d printings',2382.91,1392162530,1392162549,55,1,1),
	(205,'log','MED white complicated walking windmill thing?',2445.95,1392162568,1392162587,55,1,1),
	(206,'log','MCU playing with windmill',2489.67,1392162617,1392162623,55,1,1),
	(207,'log','MCU Michael holding metal circular thing for camera',2524.47,1392162638,1392162649,55,1,1),
	(208,'log','shows the doodler',2586.34,1392162674,1392162680,55,1,1),
	(209,'log','MCU architectural thingy',2637.26,1392162698,1392162710,55,1,1);

/*!40000 ALTER TABLE `rows` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `handle` tinytext,
  `superuser` tinyint(1) NOT NULL default '0',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `handle`, `superuser`, `created`)
VALUES
	(1,'winston',1,'2014-02-13 17:29:48'),
	(0,'guest',0,'2014-02-13 17:29:48'),
	(2,'liza',0,'2014-02-13 18:02:09');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table videos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `videos`;

CREATE TABLE `videos` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `src` tinytext,
  `title` tinytext,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;

INSERT INTO `videos` (`id`, `src`, `title`)
VALUES
	(1,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1344163/encoded/web_sd/YouKnowMeJeffyB-1344163.mp4','Food Is Free Project - farm work day'),
	(2,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1328105/encoded/web_sd/YouKnowMeJeffyB-1328105.mp4','ATX Hackerspace Boat Day'),
	(3,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1328449/encoded/web_sd/YouKnowMeJeffyB-1328449.mp4','ATX Hackerspace open house'),
	(4,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1328463/encoded/web_sd/YouKnowMeJeffyB-1328463.mp4','ATX Hackerspace Interview Marshall'),
	(5,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1328468/encoded/web_sd/YouKnowMeJeffyB-1328468.mp4','ATX Hackerspace Interview Martin'),
	(6,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1355775/encoded/web_sd/youknowmejeffyb-1355775.mp4','Jason Hibbets at Red Hat HQ'),
	(7,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1355800/encoded/web_sd/youknowmejeffyb-1355800.mp4','Better Block Project Duncan, South Carolina'),
	(8,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1355780/encoded/web_sd/youknowmejeffyb-1355780.mp4','Better Block Project Duncan, SC timelapse'),
	(9,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1355776/encoded/web_sd/youknowmejeffyb-1355776.mp4','Raleigh, North Carolina scenery'),
	(10,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1355583/encoded/web_sd/youknowmejeffyb-1355583.mp4','Mighty Mountain concert'),
	(11,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1355788/encoded/web_sd/youknowmejeffyb-1355788.mp4','Food Is Free Project guerrilla gardening bike ride'),
	(12,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1344167/encoded/web_sd/YouKnowMeJeffyB-1344167.mp4','ATX Hackerspace build-out'),
	(13,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1355791/encoded/web_sd/youknowmejeffyb-1355791.mp4','Food Is Free Project work day'),
	(14,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1344229/encoded/web_sd/YouKnowMeJeffyB-1344229.mp4','Maker Faire Round Rock'),
	(16,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1347801/encoded/web_sd/curiouser-1347801.mp4','Your Input Needed Doc : Aly Khalifa B-roll'),
	(17,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1347800/encoded/web_sd/curiouser-1347800.mp4','Your Input Needed Doc : Aly Khalifa Interview'),
	(18,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1347799/encoded/web_sd/curiouser-1347799.mp4','Your Input Needed Doc : Dale Backus/SmallHD b-roll'),
	(19,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1347798/encoded/web_sd/curiouser-1347798.mp4','Your Input Needed Doc : Dale Backus interview at SmallHD'),
	(20,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1347795/encoded/web_sd/curiouser-1347795.mp4','Your Input Needed Doc : Raleigh, NC Evening b-roll'),
	(21,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1347794/encoded/web_sd/curiouser-1347794.mp4','Your Input Needed Doc : Jason Hibbets b-roll'),
	(22,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1347785/encoded/web_sd/curiouser-1347785.mp4','Your Input Needed Doc : Jason Hibbets interview in Rale...'),
	(23,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1347293/encoded/web_sd/curiouser-1347293.mp4','Your Input Needed Doc : Raleigh, NC Daytime B-roll'),
	(24,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1329670/encoded/web_sd/curiouser-1329670.mp4','Your Input Needed Doc : Matthew Duepner B-roll'),
	(25,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1329665/encoded/web_sd/curiouser-1329665.mp4','Your Input Needed Doc : Matthew Duepner b-roll 2'),
	(26,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1329661/encoded/web_sd/curiouser-1329661.mp4','Your Input Needed Doc : Matthew Duepner b-roll'),
	(27,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1329655/encoded/web_sd/curiouser-1329655.mp4','Your Input Needed Doc : Hack Manhattan b-roll'),
	(28,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1329617/encoded/web_sd/curiouser-1329617.mp4','Your Input Needed Doc : Justin Levinson interview at Ha...'),
	(29,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1366346/encoded/web_sd/curiouser-1366346.mp4','Your Input Needed Doc : Matthew Duepner Interview'),
	(30,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1366986/encoded/web_sd/curiouser-1366986.mp4','Your Input Needed Doc : Bradford Barr interview (DC)'),
	(35,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1426943/encoded/web_sd/youknowmejeffyb-1426943.mp4','Farm Hack at Maker Faire'),
	(36,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1427280/encoded/web_sd/youknowmejeffyb-1427280.mp4','Interview with Douglas Rushkoff'),
	(37,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1427281/encoded/web_sd/youknowmejeffyb-1427281.mp4','Farm Hack Interviews'),
	(38,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1427638/encoded/web_sd/youknowmejeffyb-1427638.mp4','David Lang at Maker Faire'),
	(39,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1427639/encoded/web_sd/youknowmejeffyb-1427639.mp4','Matthew Duepner at Maker Faire'),
	(40,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1427640/encoded/web_sd/youknowmejeffyb-1427640.mp4','Andy Wekin at Maker Faire'),
	(41,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1428902/encoded/web_sd/youknowmejeffyb-1428902.mp4','World Maker Faire NYC'),
	(42,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1431036/encoded/web_sd/youknowmejeffyb-1431036.mp4','Raleigh, NC skyline timelapse'),
	(43,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1431082/encoded/web_sd/youknowmejeffyb-1431082.mp4','Raleigh, NC timelapse'),
	(44,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1434116/encoded/web_sd/curiouser-1434116.mp4','Your Input Needed Doc : NYC World Maker Faire prep b-roll'),
	(45,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1444787/encoded/web_sd/gipsova-1444787.mp4','Your Input Needed Doc: Douglas Rushkoff Interview'),
	(46,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1444789/encoded/web_sd/curiouser-1444789.mp4','Your Input Needed Doc: Matthew Duepner at Maker Faire NYC '),
	(47,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1444792/encoded/web_sd/curiouser-1444792.mp4','Your Input Needed Doc: Andy Wekin Interview'),
	(48,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1444794/encoded/web_sd/curiouser-1444794.mp4','Your Input Needed: Massimo Banzi interview at Maker Fai...'),
	(49,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1444795/encoded/web_sd/curiouser-1444795.mp4','Your Input Needed Doc: Dorn Cox at Maker Faire NYC '),
	(50,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1467722/encoded/web_sd/curiouser-1467722.mp4','Your Input Needed Doc: Mark Hatch Interview'),
	(51,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1467725/encoded/web_sd/curiouser-1467725.mp4','Your Input Needed Doc: Eben Upton Interview'),
	(52,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1467993/encoded/web_sd/curiouser-1467993.mp4','Your Input Needed Doc: Carla Diana Interview'),
	(53,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1468000/encoded/web_sd/curiouser-1468000.mp4','Your Input Needed Doc : NYC World Maker Faire b-roll'),
	(54,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1468002/encoded/web_sd/curiouser-1468002.mp4','Your Input Needed Doc : NYC World Maker Faire Quickie I...'),
	(55,'http://s3.amazonaws.com/hitrecord-prod/record_attachments/1532100/encoded/web_sd/curiouser-1532100.mp4','Your Input Needed Doc: Michael Weinberg Interview and B...');

/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
