/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 *  The sequence that assertions should be built as such: 1. Generate the ID. 2.
 *  Add the owner. 3. Set the subject. 4. Set the agent. Further functions may be
 *  called afterwards in any order. WARNING: The modifications of ownership and
 *  readership do not "just work".
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcAssertion = function() {
    Assertion.call(this);
};
EcAssertion = stjs.extend(EcAssertion, Assertion, [], function(constructor, prototype) {
    prototype.getSubject = function() {
        if (this.subject == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.subject);
        var decryptedString = v.decryptIntoString();
        if (decryptedString == null) 
            return null;
        return EcPk.fromPem(decryptedString);
    };
    prototype.getSubjectAsync = function(success, failure) {
        if (this.subject == null) {
            failure("Subject not found.");
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.subject);
        v.decryptIntoStringAsync(function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt subject.");
             else 
                success(EcPk.fromPem(decryptedString));
        }, failure);
    };
    prototype.getAgent = function() {
        if (this.agent == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.agent);
        var decryptedString = v.decryptIntoString();
        if (decryptedString == null) 
            return null;
        return EcPk.fromPem(decryptedString);
    };
    prototype.getAgentAsync = function(success, failure) {
        if (this.agent == null) {
            failure("Agent not found.");
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.agent);
        v.decryptIntoStringAsync(function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt agent.");
             else 
                success(EcPk.fromPem(decryptedString));
        }, failure);
    };
    prototype.getSubjectName = function() {
        if (this.subject == null) 
            return "Nobody";
        var subjectPk = this.getSubject();
        var identity = EcIdentityManager.getIdentity(subjectPk);
        if (identity != null && identity.displayName != null) 
            return identity.displayName + " (You)";
        var contact = EcIdentityManager.getContact(subjectPk);
        if (contact == null || contact.displayName == null) 
            return "Unknown Subject";
        return contact.displayName;
    };
    prototype.getSubjectNameAsync = function(success, failure) {
        if (this.subject == null) {
            success("Nobody");
            return;
        }
        this.getSubjectAsync(function(subjectPk) {
            var identity = EcIdentityManager.getIdentity(subjectPk);
            if (identity != null && identity.displayName != null) {
                success(identity.displayName + " (You)");
                return;
            }
            var contact = EcIdentityManager.getContact(subjectPk);
            if (contact == null || contact.displayName == null) {
                success("Unknown Subject");
                return;
            }
            success(contact.displayName);
        }, failure);
    };
    prototype.getAgentName = function() {
        if (this.agent == null) 
            return "Nobody";
        var agentPk = this.getAgent();
        var identity = EcIdentityManager.getIdentity(agentPk);
        if (identity != null && identity.displayName != null) 
            return identity.displayName + " (You)";
        var contact = EcIdentityManager.getContact(agentPk);
        if (contact == null || contact.displayName == null) 
            return "Unknown Agent";
        return contact.displayName;
    };
    prototype.getAgentNameAsync = function(success, failure) {
        if (this.subject == null) {
            success("Nobody");
            return;
        }
        this.getAgentAsync(function(subjectPk) {
            var identity = EcIdentityManager.getIdentity(subjectPk);
            if (identity != null && identity.displayName != null) {
                success(identity.displayName + " (You)");
                return;
            }
            var contact = EcIdentityManager.getContact(subjectPk);
            if (contact == null || contact.displayName == null) {
                success("Unknown Agent");
                return;
            }
            success(contact.displayName);
        }, failure);
    };
    prototype.getAssertionDate = function() {
        if (this.assertionDate == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.assertionDate);
        var decryptedString = v.decryptIntoString();
        if (decryptedString == null) 
            return null;
        return Long.parseLong(decryptedString);
    };
    prototype.getAssertionDateAsync = function(success, failure) {
        if (this.assertionDate == null) {
            failure("Assertion date not found.");
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.assertionDate);
        v.decryptIntoStringAsync(function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt assertion date.");
             else 
                success(Long.parseLong(decryptedString));
        }, failure);
    };
    prototype.getExpirationDate = function() {
        if (this.expirationDate == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.expirationDate);
        var decryptedString = v.decryptIntoString();
        if (decryptedString == null) 
            return null;
        return Long.parseLong(decryptedString);
    };
    prototype.getExpirationDateAsync = function(success, failure) {
        if (this.expirationDate == null) {
            failure("Expiration date not found.");
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.expirationDate);
        v.decryptIntoStringAsync(function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt expiration date.");
             else 
                success(Long.parseLong(decryptedString));
        }, failure);
    };
    prototype.getEvidenceCount = function() {
        if (this.evidence == null) 
            return 0;
        return this.evidence.length;
    };
    prototype.getEvidence = function(index) {
        if (this.evidence == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.evidence[index]);
        var decryptedString = v.decryptIntoString();
        return decryptedString;
    };
    prototype.getEvidenceAsync = function(index, success, failure) {
        if (this.evidence[index] == null) {
            failure("Evidence not found.");
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.evidence[index]);
        v.decryptIntoStringAsync(function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt evidence.");
             else 
                success(decryptedString);
        }, failure);
    };
    prototype.getDecayFunction = function() {
        if (this.decayFunction == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.decayFunction);
        var decryptedString = v.decryptIntoString();
        if (decryptedString == null) 
            return null;
        return decryptedString;
    };
    prototype.getDecayFunctionAsync = function(success, failure) {
        if (this.decayFunction == null) {
            failure("Decay function not found.");
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.decayFunction);
        v.decryptIntoStringAsync(function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt decay function.");
             else 
                success(decryptedString);
        }, failure);
    };
    prototype.getNegative = function() {
        if (this.negative == null) 
            return false;
        var v = new EcEncryptedValue();
        v.copyFrom(this.negative);
        var decryptedString = v.decryptIntoString();
        if (decryptedString != null) 
            decryptedString.toLowerCase();
        return "true".equals(decryptedString);
    };
    prototype.getNegativeAsync = function(success, failure) {
        if (this.negative == null) {
            failure("Negative not found.");
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.negative);
        v.decryptIntoStringAsync(function(decryptedString) {
            if (decryptedString == null) {
                failure("Could not decrypt negative.");
                return;
            }
            if (decryptedString != null) 
                decryptedString.toLowerCase();
            success("true".equals(decryptedString));
        }, failure);
    };
    /**
     *  Sets the subject of an assertion. Makes a few assumptions: Owners of the
     *  object should be able to see and change the encrypted value. Owners and
     *  readers of the object should be persisted.
     *  
     *  @param pk
     */
    prototype.setSubject = function(pk) {
        var owners = new Array();
        var readers = this.reader;
        if (readers == null) 
            readers = new Array();
        if (this.subject != null) {
            owners.concat(this.subject.owner);
            readers.concat(this.subject.reader);
        }
        owners = owners.concat(this.owner);
        readers.push(pk.toPem());
        this.subject = EcEncryptedValue.encryptValue(pk.toPem(), this.id, owners, readers);
    };
    prototype.setAgent = function(pk) {
        this.agent = EcEncryptedValue.encryptValue(pk.toPem(), this.id, this.subject.owner, this.subject.reader);
    };
    prototype.setCompetency = function(competencyUrl) {
        this.competency = competencyUrl;
    };
    prototype.setLevel = function(levelUrl) {
        this.level = levelUrl;
    };
    prototype.setConfidence = function(confidenceZeroToOne) {
        this.confidence = confidenceZeroToOne;
    };
    prototype.setEvidence = function(evidences) {
        var encryptedValues = new Array();
        for (var i = 0; i < evidences.length; i++) 
            encryptedValues.push(EcEncryptedValue.encryptValue(evidences[i], this.id, this.subject.owner, this.subject.reader));
        this.evidence = encryptedValues;
    };
    prototype.setAssertionDate = function(assertionDateMs) {
        this.assertionDate = EcEncryptedValue.encryptValue(assertionDateMs.toString(), this.id, this.subject.owner, this.subject.reader);
    };
    prototype.setExpirationDate = function(expirationDateMs) {
        this.expirationDate = EcEncryptedValue.encryptValue(expirationDateMs.toString(), this.id, this.subject.owner, this.subject.reader);
    };
    prototype.setDecayFunction = function(decayFunctionText) {
        this.decayFunction = EcEncryptedValue.encryptValue(decayFunctionText.toString(), this.id, this.subject.owner, this.subject.reader);
    };
    prototype.setNegative = function(negativeB) {
        this.negative = EcEncryptedValue.encryptValue(negativeB.toString(), this.id, this.subject.owner, this.subject.reader);
    };
    prototype.save = function(success, failure) {
        if (this.competency == null || this.competency == "") {
            var msg = "Failing to save: Competency cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.subject == null) {
            var msg = "Failing to save: Subject cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.agent == null) {
            var msg = "Failing to save: Agent cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.confidence == null) {
            var msg = "Failing to save: Confidence cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.assertionDate == null) {
            var msg = "Failing to save: Assertion Date cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.decayFunction == null) {
            var msg = "Failing to save: Decay Function cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        EcRepository._save(this, success, failure);
    };
    prototype.addReader = function(newReader) {
        if (this.agent != null) {
            this.agent = EcEncryptedValue.revive(this.agent);
            this.agent.addReader(newReader);
        }
        if (this.assertionDate != null) {
            this.assertionDate = EcEncryptedValue.revive(this.assertionDate);
            this.assertionDate.addReader(newReader);
        }
        if (this.decayFunction != null) {
            this.decayFunction = EcEncryptedValue.revive(this.decayFunction);
            this.decayFunction.addReader(newReader);
        }
        if (this.evidence != null) 
            for (var i = 0; i < this.evidence.length; i++) {
                this.evidence[i] = EcEncryptedValue.revive(this.evidence[i]);
                this.evidence[i].addReader(newReader);
            }
        if (this.expirationDate != null) {
            this.expirationDate = EcEncryptedValue.revive(this.expirationDate);
            this.expirationDate.addReader(newReader);
        }
        if (this.negative != null) {
            this.negative = EcEncryptedValue.revive(this.negative);
            this.negative.addReader(newReader);
        }
        if (this.subject != null) {
            this.subject = EcEncryptedValue.revive(this.subject);
            this.subject.addReader(newReader);
        }
    };
    prototype.removeReader = function(newReader) {
        if (this.agent != null) {
            this.agent = EcEncryptedValue.revive(this.agent);
            this.agent.removeReader(newReader);
        }
        if (this.assertionDate != null) {
            this.assertionDate = EcEncryptedValue.revive(this.assertionDate);
            this.assertionDate.removeReader(newReader);
        }
        if (this.decayFunction != null) {
            this.decayFunction = EcEncryptedValue.revive(this.decayFunction);
            this.decayFunction.removeReader(newReader);
        }
        if (this.evidence != null) 
            for (var i = 0; i < this.evidence.length; i++) {
                this.evidence[i] = EcEncryptedValue.revive(this.evidence[i]);
                this.evidence[i].removeReader(newReader);
            }
        if (this.expirationDate != null) {
            this.expirationDate = EcEncryptedValue.revive(this.expirationDate);
            this.expirationDate.removeReader(newReader);
        }
        if (this.negative != null) {
            this.negative = EcEncryptedValue.revive(this.negative);
            this.negative.removeReader(newReader);
        }
        if (this.subject != null) {
            this.subject = EcEncryptedValue.revive(this.subject);
            this.subject.removeReader(newReader);
        }
    };
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var assertion = new EcAssertion();
            if (p1.isAny(assertion.getTypes())) {
                assertion.copyFrom(p1);
                if (success != null) 
                    success(assertion);
            } else {
                var msg = "Retrieved object was not an assertion";
                if (failure != null) 
                    failure(msg);
                 else 
                    console.error(msg);
            }
        }, failure);
    };
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = new EcAssertion().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var assertion = new EcAssertion();
                    assertion.copyFrom(p1[i]);
                    ret[i] = assertion;
                }
                success(ret);
            }
        }, failure);
    };
    prototype.getSearchStringByTypeAndCompetency = function(competency) {
        return "(" + this.getSearchStringByType() + " AND competency:\"" + competency.shortId() + "\")";
    };
}, {subject: "EcEncryptedValue", agent: "EcEncryptedValue", evidence: {name: "Array", arguments: ["EcEncryptedValue"]}, assertionDate: "EcEncryptedValue", expirationDate: "EcEncryptedValue", decayFunction: "EcEncryptedValue", negative: "EcEncryptedValue", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Implementation of a Rollup Rule object with methods for interacting with CASS
 *  services on a server.
 *  
 *  @module org.cassproject
 *  @class EcRollupRule
 *  @constructor
 *  @extends RollupRule
 *  
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 */
var EcRollupRule = function() {
    RollupRule.call(this);
};
EcRollupRule = stjs.extend(EcRollupRule, RollupRule, [], function(constructor, prototype) {
    /**
     *  Method for setting a rollup rule name
     *  
     *  @memberOf EcRollupRule
     *  @method setName
     *  @param name
     */
    prototype.setName = function(name) {
        this.name = name;
    };
    /**
     *  Method for setting a rollup rule description
     *  
     *  @memberOf EcRollupRule
     *  @method setDescription
     *  @param {String} description
     */
    prototype.setDescription = function(description) {
        this.description = description;
    };
    /**
     *  Saves this rollup rules details on the server specified by its ID
     *  
     *  @memberOf EcRollupRule
     *  @method save
     *  @param {Callback1<String>} success
     *  			Callback triggered on successful save of rollup rule
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error saving rollup rule
     */
    prototype.save = function(success, failure) {
        if (this.rule == null || this.rule == "") {
            var msg = "RollupRule Rule cannot be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.competency == null || this.competency == "") {
            var msg = "RollupRule's Competency cannot be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        EcRepository._save(this, success, failure);
    };
    /**
     *  Deletes this rollup rule from the server specified by it's ID
     *  
     *  @memberOf EcRollupRule
     *  @method _delete
     *  @param {Callback1<String>} success
     *  			Callback triggered on successful deleting the rollup rle
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error deleting the rollup rule
     */
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
    /**
     * 
     *  Retrieves a rollup rule from the server
     *  
     *  @memberOf EcRollupRule
     *  @method get
     *  @static
     *  @param {String} id
     *  			ID of the rollup rule to retrieve
     *  @param {Callback1<EcRollupRule>} success
     *  			Callback triggered on successful retrieving rollup rule, 
     *  			returns the rollup rule
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error retrieving rollup rule
     */
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            if (success == null) 
                return;
            if (!p1.isA(EcRollupRule.myType)) {
                if (failure != null) 
                    failure("Resultant object is not a level.");
                return;
            }
            var c = new EcRollupRule();
            c.copyFrom(p1);
            success(c);
        }, function(p1) {
            if (failure != null) 
                failure(p1);
        });
    };
    /**
     *  Searches for levels with a string query
     *  
     *  @memberOf EcRollupRule
     *  @method search
     *  @static
     *  @param {EcRepository} repo
     *  			Repository to search for levels
     *  @param {String} query
     *  			query string to use in search
     *  @param {Callback1<Array<EcRollupRule>>} success
     *  			Callback triggered when searches successfully
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error occurs while searching
     *  @param {Object} paramObj
     *  			Search parameters object to pass in
     *  		@param size
     *  		@param start
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new EcRollupRule().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var rule = new EcRollupRule();
                    if (p1[i].isAny(rule.getTypes())) {
                        rule.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcRollupRule.myType)) {
                            var obj = val.decryptIntoObject();
                            rule.copyFrom(obj);
                            EcEncryptedValue.encryptOnSave(rule.id, true);
                        }
                    }
                    ret[i] = rule;
                }
                success(ret);
            }
        }, failure);
    };
}, {image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Implementation of an alignment object with methods for interacting with CASS
 *  services on a server.
 *  
 *  @module org.cassproject
 *  @class EcAlignment
 *  @constructor
 *  @extends Relation
 *  
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 *  
 *  TODO: Test case where an absent relation is in the framework.
 */
var EcAlignment = function() {
    Relation.call(this);
};
EcAlignment = stjs.extend(EcAlignment, Relation, [], function(constructor, prototype) {
    /**
     *  Setter for alignment name
     *  
     *  @memberOf EcAlignment
     *  @method setName
     *  @param {String} name
     *  			name to give this alignment
     */
    prototype.setName = function(name) {
        this.name = name;
    };
    /**
     *  Setter for alignment description
     *  
     *  @memberOf EcAlignment
     *  @method setDescription
     *  @param {String} description
     *  			description to give this alignment
     */
    prototype.setDescription = function(description) {
        this.description = description;
    };
    /**
     *  Saves this alignment details on the server corresponding to its ID 
     *  
     *  @memberOf EcAlignment
     *  @method save
     *  @param {Callback1<String>} success
     *  			Callback triggered on successfully saving the alignment
     *  @param {Callback1<String>} [failure]
     *  			Callback triggered if error while saving alignment
     */
    prototype.save = function(success, failure) {
        if (this.source == null || this.source == "") {
            var msg = "Source Competency cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.target == null || this.target == "") {
            var msg = "Target Competency cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.relationType == null || this.relationType == "") {
            var msg = "Relation Type cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        EcRepository._save(this, success, failure);
    };
    /**
     *  Deletes the alignment from the server corresponding to its ID
     *  
     *  @memberOf EcAlignment
     *  @method _delete
     *  @param {Callback1<String>} success
     *  			Callback triggered on successfully deleting the alignment
     *  @param {Callback1<String>} [failure]
     *  			Callback triggered if error while deleting alignment
     */
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
    /**
     *  Retrieves the alignment specified with the ID from the server
     *  
     *  @memberOf EcAlignment
     *  @method get
     *  @static
     *  @param {String} id
     *  			ID of the alignment to retrieve
     *  @param {Callback1<EcAlignment>} success
     *  			Callback triggered on successfully retrieving the alignment,
     *  			returns the alignment
     *  @param {Callback1<String>} [failure]
     *  			Callback triggered if error while retrieving alignment
     */
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var relation = new EcAlignment();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
            }
            if (p1.isAny(relation.getTypes())) {
                relation.copyFrom(p1);
                if (success != null) 
                    success(relation);
            } else {
                var msg = "Resultant object is not a relation.";
                if (failure != null) 
                    failure(msg);
                 else 
                    console.error(msg);
            }
        }, failure);
    };
    /**
     *  Retrieves an alignment from it's server synchronously, the call 
     *  blocks until it is successful or an error occurs
     *  
     *  @memberOf EcAlignment
     *  @method getBlocking
     *  @static
     *  @param {String} id
     *  			ID of the alignment to retrieve
     *  @return EcAlignment
     *  			The alignment retrieved
     */
    constructor.getBlocking = function(id) {
        var p1 = EcRepository.getBlocking(id);
        var alignment = new EcAlignment();
        if (p1.isA(EcEncryptedValue.myType)) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            p1 = encrypted.decryptIntoObject();
            EcEncryptedValue.encryptOnSave(p1.id, true);
        }
        if (p1.isAny(alignment.getTypes())) {
            alignment.copyFrom(p1);
            return alignment;
        } else {
            var msg = "Retrieved object was not a relation";
            console.error(msg);
            return null;
        }
    };
    /**
     *  Searches the repository using the query and optional parameters provided
     *  
     *  @memberOf EcAlignment
     *  @method search
     *  @static
     *  @param {EcRepository} repo
     *  			Repository to search using the query provided
     *  @param {String} query
     *  			The query to send to the search
     *  @param {Callback1<Array<EcAlignment>>} success
     *  			Callback triggered on successful search return
     *  @param {Callback1<String>} [failure]
     *  			Callback triggered if error searching
     *  @param {Object} [paramObj]
     *  			Parameters to include in the search
     *  		@param start
     *  		@param size
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = new EcAlignment().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            alignment.copyFrom(obj);
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure);
    };
    /**
     *  Searches the repository for alignments with a specific ID in the source field
     *  
     *  @memberOf EcAlignment
     *  @method searchBySource
     *  @static
     *  @param {EcRepository} repo
     *  			Repository to search for alignments with the source specified
     *  @param {String} sourceId
     *  			ID in the source field of the alignments to find
     *  @param {Callback1<Array<EcAlignment>>} success
     * 			Callback triggered on successful search return
     *  @param {Callback1<String>} [failure]
     *  			Callback triggered if error searching
     *  @param {Object} [paramObj]
     *  			Parameters to include in the search
     *  		@param start
     *  		@param size
     */
    constructor.searchBySource = function(repo, sourceId, success, failure, paramObj) {
        var query = "";
        query = "(" + new EcAlignment().getSearchStringByType();
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(sourceId);
        if (noVersion == sourceId) {
            query += " AND (source:\"" + sourceId + "\"))";
        } else {
            query += " AND (source:\"" + sourceId + "\" OR source:\"" + noVersion + "\"))";
        }
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["source"] != sourceId && (obj)["source"] != noVersion) {
                                continue;
                            }
                            alignment.copyFrom(obj);
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure);
    };
    /**
     *  Searches the repository for alignments with a specific ID in the target field
     *  
     *  @memberOf EcAlignment
     *  @method searchByCompetency
     *  @static
     *  @param {EcRepository} repo
     *  			Repository to search for alignments with the source specified
     *  @param {String} competencyId
     *  			ID in the target field of the alignments to find
     *  @param {Callback1<Array<EcAlignment>>} success
     * 			Callback triggered on successful search return
     *  @param {Callback1<String>} [failure]
     *  			Callback triggered if error searching
     *  @param {Object} [paramObj]
     *  			Parameters to include in the search
     *  		@param start
     *  		@param size
     */
    constructor.searchByCompetency = function(repo, competencyId, success, failure, paramObj) {
        var query = "";
        query = "(" + new EcAlignment().getSearchStringByType();
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(competencyId);
        if (noVersion == competencyId) {
            query += " AND (source:\"" + competencyId + "\" OR target:\"" + competencyId + "\"))";
        } else {
            query += " AND (source:\"" + competencyId + "\" OR source:\"" + noVersion + "\" OR target:\"" + competencyId + "\" OR target:\"" + noVersion + "\"))";
        }
        query += " OR @encryptedType:\"" + EcAlignment.myType + "\" OR @encryptedType:\"" + EcAlignment.myType.replace(Cass.context + "/", "") + "\")";
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["source"] != competencyId && (obj)["source"] != noVersion && (obj)["target"] != competencyId && (obj)["target"] != noVersion) {
                                continue;
                            }
                            alignment.copyFrom(obj);
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure);
    };
}, {image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Implementation of a Level object with methods for interacting with CASS
 *  services on a server.
 *  
 *  @module org.cassproject
 *  @class EcLevel
 *  @constructor
 *  @extends Level
 *  
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 */
var EcLevel = function() {
    Level.call(this);
};
EcLevel = stjs.extend(EcLevel, Level, [], function(constructor, prototype) {
    /**
     *  Adds a relationship between this level and a target level to define
     *  how they correspond to one another
     *  
     *  @memberOf EcLevel
     *  @method addRelationship
     *  @param {EcLevel} targetLevel
     *  			Target level of the relationship
     *  @param {String} alignmentType
     *  			Type of relationship
     *  @param {EcPpk} identity
     *  			Private key that will own the new relationship
     *  @param {String} server
     *  			URL Prefix of the new relationship ID (Server it will be saved on)
     */
    prototype.addRelationship = function(targetLevel, alignmentType, identity, server) {
        var a = new EcAlignment();
        a.source = this.id;
        a.target = targetLevel.id;
        a.relationType = alignmentType;
        a.addOwner(identity.toPk());
        a.generateId(server);
        a.signWith(identity);
    };
    /**
     *  Method to set the name of this level
     *  
     *  @memberOf EcLevel
     *  @method setName
     *  @param {String} name
     *  			Name to set on the level
     */
    prototype.setName = function(name) {
        this.name = name;
    };
    /**
     *  Method to set the description of the level
     *  
     *  @memberOf EcLevel
     *  @method setDescription
     *  @param {String} description
     *  			Description to set on the level
     */
    prototype.setDescription = function(description) {
        this.description = description;
    };
    /**
     *  Saves this levels details to the server
     *  
     *  @memberOf EcLevel
     *  @method save
     *  @param {Callback1<String>} success
     *  			Callback triggered on successfully saving the level to the server
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs while saving the level to the server
     */
    prototype.save = function(success, failure) {
        if (this.name == null || this.name == "") {
            var msg = "Level name cannot be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.competency == null || this.competency == "") {
            var msg = "Level's Competency cannot be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        EcRepository._save(this, success, failure);
    };
    /**
     *  Deletes the level from it's repository
     *  
     *  @memberOf EcLevel
     *  @method _delete
     *  @param {Callback1<String>} success
     *  			Callback triggered when the level is successfully deleted from the server
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error occurs while deleting the level
     */
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
    /**
     *  Retrieves a level from the server specified by its ID
     *  
     *  @memberOf EcLevel
     *  @method get
     *  @static
     *  @param {String} id
     *  			ID of the level to retrieve
     *  @param {Callback1<EcLevel>} success
     *  			Callback triggered when successfully retrieving the level, 
     *  			returns the level
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs when retrieving the level
     */
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var level = new EcLevel();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
                EcEncryptedValue.encryptOnSave(p1.id, true);
            }
            if (p1.isAny(level.getTypes())) {
                level.copyFrom(p1);
                if (success != null) 
                    success(level);
            } else {
                var msg = "Resultant object is not a level.";
                if (failure != null) 
                    failure(msg);
                 else 
                    console.error(msg);
            }
        }, failure);
    };
    /**
     *  Searches for levels with a string query
     *  
     *  @memberOf EcLevel
     *  @method search
     *  @static
     *  @param {EcRepository} repo
     *  			Repository to search for levels
     *  @param {String} query
     *  			query string to use in search
     *  @param {Callback1<Array<EcLevel>>} success
     *  			Callback triggered when searches successfully
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error occurs while searching
     *  @param {Object} paramObj
     *  			Search parameters object to pass in
     *  		@param size
     *  		@param start
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new EcLevel().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var level = new EcLevel();
                    if (p1[i].isAny(level.getTypes())) {
                        level.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcLevel.myType)) {
                            var obj = val.decryptIntoObject();
                            level.copyFrom(obj);
                            EcEncryptedValue.encryptOnSave(level.id, true);
                        }
                    }
                    ret[i] = level;
                }
                success(ret);
            }
        }, failure);
    };
    /**
     *  Searches for levels using a competency that the results must be related to
     *  
     *  @memberOf EcLevel
     *  @method searchByCompetency
     *  @static
     *  @param {EcRepository} repo
     *  			Repository to search for levels
     *  @param {String} competencyId
     *  			competency ID that the levels are rleated to
     *  @param {Callback1<Array<EcLevel>>} success
     *  			Callback triggered when searches successfully
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error occurs while searching
     *  @param {Object} paramObj
     *  			Search parameters object to pass in
     *  		@param size
     *  		@param start
     */
    constructor.searchByCompetency = function(repo, competencyId, success, failure, paramObj) {
        if (competencyId == null || competencyId == "") {
            failure("No Competency Specified");
            return;
        }
        var query = "(" + new EcLevel().getSearchStringByType();
        query += " AND ( competency:\"" + competencyId + "\" OR competency:\"" + EcRemoteLinkedData.trimVersionFromUrl(competencyId) + "\"))";
        query += " OR @encryptedType:\"" + EcLevel.myType + "\" OR @encryptedType:\"" + EcLevel.myType.replace(Cass.context + "/", "") + "\"";
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var levels = [];
                for (var i = 0; i < p1.length; i++) {
                    var level = new EcLevel();
                    if (p1[i].isAny(level.getTypes())) {
                        level.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcLevel.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["competency"] != competencyId) {
                                continue;
                            }
                            level.copyFrom(obj);
                            EcEncryptedValue.encryptOnSave(level.id, true);
                        }
                    }
                    level.copyFrom(p1[i]);
                    levels[i] = level;
                }
                if (success != null) 
                    success(levels);
            }
        }, failure);
    };
}, {image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Implementation of a Competency object with methods for interacting with CASS
 *  services on a server.
 *  
 *  @module org.cassproject
 *  @class EcCompetency
 *  @constructor
 *  @extends Competency
 *  
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 */
var EcCompetency = function() {
    Competency.call(this);
};
EcCompetency = stjs.extend(EcCompetency, Competency, [], function(constructor, prototype) {
    /**
     *  Adds a new alignment on the server specified with this competency as its 
     *  source and the specified target competency 
     *  
     *  @memberOf EcCompetency
     *  @method addAlignment
     *  @param {EcCompetency} target
     *  			Competency to be related with
     *  @param {String} alignmentType
     *  			String defining the relationship type
     *  @param {EcPpk} owner
     *  			Private Key that will own the relationship created
     *  @param {String} server
     *  			URL Prefix of the new relationship (Server it will be saved on)
     *  @param {Callback1<String>} success
     *  			Callback triggered after successfully creating and saving the relationship
     *  @param {Callback1<String>} [failure]
     *  			Callback triggered if error creating and saving relationship
     *  @return EcAlignment
     *  			Created relationship
     */
    prototype.addAlignment = function(target, alignmentType, owner, server, success, failure) {
        var a = new EcAlignment();
        a.generateId(server);
        a.source = this.shortId();
        a.target = target.shortId();
        a.relationType = alignmentType;
        a.addOwner(owner.toPk());
        EcRepository._save(a, success, failure);
        return a;
    };
    /**
     *  Searches the repository given for any relationships that contain this competency
     *  
     *  @memberOf EcCompetency
     *  @method relations
     *  @param {EcRepository} repo
     *  			Repository to search for relationships
     *  @param {Callback1<EcAlignment>} eachSuccess
     *  			Callback triggered for each relationship found
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error finding relationships
     *  @param {Callback1<Array<EcAlignment>>} successAll
     *  			Callback triggered once all of the relationships have been found
     */
    prototype.relations = function(repo, eachSuccess, failure, successAll) {
        this.relationships(repo, eachSuccess, failure, successAll);
    };
    /**
     *  Searches the repository given for any relationships that contain this competency
     *  
     *  @memberOf EcCompetency
     *  @method relations
     *  @deprecated
     *  @param {EcRepository} repo
     *  			Repository to search for relationships
     *  @param {Callback1<EcAlignment>} eachSuccess
     *  			Callback triggered for each relationship found
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error finding relationships
     *  @param {Callback1<Array<EcAlignment>>} successAll
     *  			Callback triggered once all of the relationships have been found
     */
    prototype.relationships = function(repo, eachSuccess, failure, successAll) {
        repo.search(new EcAlignment().getSearchStringByType() + " AND (source:\"" + this.id + "\" OR target:\"" + this.id + "\" OR source:\"" + this.shortId() + "\" OR target:\"" + this.shortId() + "\")", function(p1) {
            var a = new EcAlignment();
            a.copyFrom(p1);
            if (eachSuccess != null) 
                eachSuccess(a);
        }, function(p1) {
            if (successAll != null) {
                var rels = [];
                for (var i = 0; i < p1.length; i++) {
                    var a = new EcAlignment();
                    a.copyFrom(p1[i]);
                    rels[i] = a;
                }
                if (successAll != null) 
                    successAll(rels);
            }
        }, failure);
    };
    /**
     *  Adds a new level on the server specified for this competency.
     *  
     *  @memberOf EcCompetency
     *  @method addLevel
     *  @param {String} name
     *  			Name of the new level to create
     *  @param {String} description
     *  			Description of the new level to create
     *  @param {String} owner
     *  			Private key of the owner of the new level
     *  @param {String} server
     *  			URL Prefix for the new level's ID (Server saved on)
     *  @param {Callback1<String>} success
     *  			Callback triggered after successfully creating and saving the level
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error creating and saving the level
     *  @return EcLevel
     *  			Level created
     */
    prototype.addLevel = function(name, description, owner, server, success, failure) {
        var l = new EcLevel();
        l.generateId(server);
        l.competency = this.shortId();
        l.description = description;
        l.name = name;
        l.addOwner(owner.toPk());
        EcRepository._save(l, success, failure);
        return l;
    };
    /**
     *  Searches the repository given for any levels of this competency
     *  
     *  @memberOf EcCompetency
     *  @method levels
     *  @param {EcRepository} repo
     *  			Repository to search for levels
     *  @param {Callback1<EcLevel>} success
     *  			Callback triggered for each level found
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error finding levels
     *  @param {Callback1<Array<EcLevel>>} successAll
     *  			Callback triggered once all of the levels have been found
     */
    prototype.levels = function(repo, success, failure, successAll) {
        var query = "(" + new EcLevel().getSearchStringByType() + " AND ( competency:\"" + this.id + "\" OR competency:\"" + this.shortId() + "\"))";
        query += " OR @encryptedType:\"" + EcLevel.myType + "\" OR @encryptedType:\"" + EcLevel.myType.replace(Cass.context + "/", "") + "\"";
        var competencyId = this.id;
        var shortId = this.shortId();
        repo.search(query, function(p1) {
            if (success != null) {
                var a = new EcLevel();
                if (p1.isA(EcLevel.myType)) {
                    a.copyFrom(p1);
                } else if (p1.isA(EcEncryptedValue.myType)) {
                    var val = new EcEncryptedValue();
                    val.copyFrom(p1);
                    if (val.isAnEncrypted(EcLevel.myType)) {
                        var obj = val.decryptIntoObject();
                        if ((obj)["competency"] != competencyId && (obj)["competency"] != shortId) {
                            return;
                        }
                        a.copyFrom(obj);
                        EcEncryptedValue.encryptOnSave(a.id, true);
                    }
                }
                success(a);
            }
        }, function(p1) {
            if (successAll != null) {
                var levels = [];
                for (var i = 0; i < p1.length; i++) {
                    var a = new EcLevel();
                    if (p1[i].isA(EcLevel.myType)) {
                        a.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcLevel.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["competency"] != competencyId && (obj)["competency"] != shortId) {
                                continue;
                            }
                            a.copyFrom(obj);
                            EcEncryptedValue.encryptOnSave(a.id, true);
                        }
                    }
                    levels[i] = a;
                }
                if (successAll != null) 
                    successAll(levels);
            }
        }, failure);
    };
    /**
     *  Adds a new rollup rule on the server specified for this competency
     *  
     *  @memberOf EcCompetency
     *  @method addRollupRule
     *  @param {String} name
     *  			Name of the rollup rule to create
     *  @param {String} description
     *  			Description of the rollup rule to create
     *  @param {EcPpk} owner
     *  			Private key that will own the new rollup rule
     *  @param {String} server
     *  			URL Prefix for the new rollup rule's ID (Server that it will be saved on)
     *  @param {Callback1<String>} success
     *  			Callback triggered if successfully save the rollup rule
     *  @param {Callback1<String>} failure
     *  			Callback triggered fi error during save of rollup rule
     *  @return EcRollupRule
     *  			Created rollup rule
     */
    prototype.addRollupRule = function(name, description, owner, server, success, failure) {
        var r = new EcRollupRule();
        r.generateId(server);
        r.competency = this.shortId();
        r.description = description;
        r.name = name;
        r.addOwner(owner.toPk());
        EcRepository._save(r, success, failure);
        return r;
    };
    /**
     *  Searches the repository given for any rollup rules of this competency
     *  
     *  @memberOf EcCompetency
     *  @method rollupRules
     *  @param {EcRepository} repo
     *  			Repository to search for levels
     *  @param {Callback1<EcRollupRule>} success
     *  			Callback triggered for each rollup rule found
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error finding rollup rule
     *  @param {Callback1<Array<EcRollupRule>} successAll
     *  			Callback triggered once all of the rollup rules have been found
     */
    prototype.rollupRules = function(repo, success, failure, successAll) {
        var query = "(" + new EcRollupRule().getSearchStringByType() + " AND ( competency:\"" + this.id + "\" OR competency:\"" + this.shortId() + "\"))";
        query += " OR @encryptedType:\"" + EcRollupRule.myType + "\" OR @encryptedType:\"" + EcRollupRule.myType.replace(Cass.context + "/", "") + "\"";
        var competencyId = this.id;
        var shortId = this.shortId();
        repo.search(query, function(p1) {
            if (success != null) {
                var a = new EcRollupRule();
                if (p1.isA(EcRollupRule.myType)) {
                    a.copyFrom(p1);
                } else if (p1.isA(EcEncryptedValue.myType)) {
                    var val = new EcEncryptedValue();
                    val.copyFrom(p1);
                    if (val.isAnEncrypted(EcRollupRule.myType)) {
                        var obj = val.decryptIntoObject();
                        if ((obj)["competency"] != competencyId && (obj)["competency"] != shortId) {
                            return;
                        }
                        a.copyFrom(obj);
                        EcEncryptedValue.encryptOnSave(a.id, true);
                    }
                }
                success(a);
            }
        }, function(p1) {
            if (successAll != null) {
                var rollupRules = [];
                for (var i = 0; i < p1.length; i++) {
                    var a = new EcRollupRule();
                    if (p1[i].isA(EcRollupRule.myType)) {
                        a.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcRollupRule.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["competency"] != competencyId && (obj)["competency"] != shortId) {
                                continue;
                            }
                            a.copyFrom(obj);
                            EcEncryptedValue.encryptOnSave(a.id, true);
                        }
                    }
                    rollupRules[i] = a;
                }
                if (successAll != null) 
                    successAll(rollupRules);
            }
        }, failure);
    };
    /**
     *  Method to set competency name
     *  
     *  @memberOf EcCompetency
     *  @method setName
     *  @param {String} name
     * 			Name to set for this competency
     */
    prototype.setName = function(name) {
        this.name = name;
    };
    /**
     *  Method to set competency description
     *  
     *  @memberOf EcCompetency
     *  @method setDescription
     *  @param {String} description
     *  			Description to set for its competency
     */
    prototype.setDescription = function(description) {
        this.description = description;
    };
    /**
     *  Method to set competency scope
     *  
     *  @memberOf EcCompetency
     *  @method setScope
     *  @param {String} scope
     *  			Scope to set for its competency
     */
    prototype.setScope = function(scope) {
        this.scope = scope;
    };
    /**
     *  Saves the competency details to the server
     *  
     *  @memberOf EcCompetency
     *  @method save
     *  @param {Callback1<String>} success
     *  			Callback triggered on successfully saving the competency
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error saving competency
     */
    prototype.save = function(success, failure) {
        if (this.name == null || this.name == "") {
            var msg = "Competency Name can not be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        EcRepository._save(this, success, failure);
    };
    /**
     *  Deletes the competency from the server
     *  
     *  TODO: Delete rollup rules?
     *  
     *  @memberOf EcCompetency
     *  @method _delete
     *  @param {Callback1<String>} success
     *  			Callback triggered on successful deleting the competency
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error deleting the competency
     *  @param {EcRepository} repo
     *  			Repository to delete from and to check for levels or relationships to delete
     */
    prototype._delete = function(success, failure, repo) {
        var me = this;
        EcRepository.DELETE(this, function(p1) {
            if (repo != null) {
                me.relationships(repo, function(p1) {
                    for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                        if (p1.canEdit(EcIdentityManager.ids[i].ppk.toPk())) {
                            p1._delete(null, function(p1) {
                                if (failure != null) 
                                    failure("Unable to Delete Competency Relation");
                                 else 
                                    console.error("Unable to Delete Competency Relation");
                            });
                            return;
                        }
                    }
                }, failure, function(p1) {
                    if (success != null) 
                        success("");
                });
                me.levels(repo, function(p1) {
                    for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                        if (p1.canEdit(EcIdentityManager.ids[i].ppk.toPk())) {
                            p1._delete(null, function(p1) {
                                if (failure != null) 
                                    failure("Unable to Delete Competency Relation");
                                 else 
                                    console.error("Unable to Delete Competency Relation");
                            });
                            return;
                        }
                    }
                }, failure, function(p1) {
                    if (success != null) 
                        success("");
                });
            } else {
                if (success != null) 
                    success(p1);
            }
        }, failure);
    };
    /**
     *  Retrieves a competency from it's server asynchronously
     *  
     *  @memberOf EcCompetency
     *  @method get
     *  @static
     *  @param {String} id
     *  			ID of the competency to retrieve from the server
     *  @param {Callback1<String>} success
     *  			Callback triggered after retrieving the competency,
     *  			returns the competency retrieved
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error retrieving competency
     */
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var competency = new EcCompetency();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
                EcEncryptedValue.encryptOnSave(p1.id, true);
            }
            if (p1.isAny(competency.getTypes())) {
                competency.copyFrom(p1);
                if (success != null) 
                    success(competency);
            } else {
                var msg = "Retrieved object was not a competency";
                if (failure != null) 
                    failure(msg);
                 else 
                    console.error(msg);
            }
        }, failure);
    };
    /**
     *  Retrieves a competency from it's server synchronously, the call 
     *  blocks until it is successful or an error occurs
     *  
     *  @memberOf EcCompetency
     *  @method getBlocking
     *  @static
     *  @param {String} id
     *  			ID of the competency to retrieve
     *  @return EcCompetency
     *  			The competency retrieved
     */
    constructor.getBlocking = function(id) {
        var p1 = EcRepository.getBlocking(id);
        var competency = new EcCompetency();
        if (p1.isA(EcEncryptedValue.myType)) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            p1 = encrypted.decryptIntoObject();
            EcEncryptedValue.encryptOnSave(p1.id, true);
        }
        if (p1.isAny(competency.getTypes())) {
            competency.copyFrom(p1);
            return competency;
        } else {
            var msg = "Retrieved object was not a competency";
            console.error(msg);
            return null;
        }
    };
    /**
     *  Searches a repository for competencies that match the search query 
     *  
     *  @memberOf EcCompetency
     *  @method search
     *  @static
     *  @param {EcRepository} repo
     *  			Repository to search using the query
     *  @param {String} query
     *  			Query string to pass to the search web service
     *  @param {Callback1<Array<EcCompetency>> success
     *  			Callback triggered after completing the search, returns the results
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error searching
     *  @param {Object} paramObj
     *  			Parameter object for search
     *  		@param start
     *  		@param size
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new EcCompetency().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var comp = new EcCompetency();
                    if (p1[i].isAny(comp.getTypes())) {
                        comp.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcCompetency.myType)) {
                            var obj = val.decryptIntoObject();
                            comp.copyFrom(obj);
                            EcEncryptedValue.encryptOnSave(comp.id, true);
                        }
                    }
                    ret[i] = comp;
                }
                success(ret);
            }
        }, failure);
    };
}, {image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Implementation of a Framework object with methods for interacting with CASS
 *  services on a server.
 *  
 *  @module org.cassproject
 *  @class EcFramework
 *  @constructor
 *  @extends Framework
 *  
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 */
var EcFramework = function() {
    Framework.call(this);
};
EcFramework = stjs.extend(EcFramework, Framework, [], function(constructor, prototype) {
    constructor.relDone = {};
    constructor.levelDone = {};
    /**
     *  Adds the competency ID specified to the frameworks list of competency IDs
     *  
     *  @memberOf EcFramework
     *  @method addCompetency
     *  @param {String} id
     *  			ID of the competency to add
     */
    prototype.addCompetency = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.competency == null) 
            this.competency = new Array();
        for (var i = 0; i < this.competency.length; i++) 
            if (this.competency[i].equals(id)) 
                return;
        this.competency.push(id);
    };
    /**
     *  Removes a competency ID from the framework's list, also removes any
     *  levels and relations associated with that competency
     *  
     *  TODO: remove rollup rules? should we add flag to remove these extras
     *  
     *  @memberOf EcFramework
     *  @method removeCompetency
     *  @param {String} id
     *  			ID of the competency to remove
     *  @param {Callback1<String>} success
     *  			Callback triggered after succesfully removing the competency and levels and relationships
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs when removing competency and levels and relationships
     */
    prototype.removeCompetency = function(id, success, failure) {
        var shortId = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.competency == null) 
            this.competency = new Array();
        for (var i = 0; i < this.competency.length; i++) 
            if (this.competency[i].equals(shortId) || this.competency[i].equals(id)) 
                this.competency.splice(i, 1);
        if ((this.relation == null || this.relation.length == 0) && (this.level == null || this.level.length == 0)) 
            if (success != null) 
                success("");
        EcFramework.relDone[id] = false;
        EcFramework.levelDone[id] = false;
        if (this.relation != null) {
            this.removeRelationshipsThatInclude(id, 0, function(p1) {
                if (EcFramework.levelDone[id]) {
                    if (success != null) 
                        success(p1);
                } else {
                    EcFramework.relDone[id] = true;
                }
            }, failure);
        } else {
            EcFramework.relDone[id] = true;
        }
        if (this.level != null) {
            this.removeLevelsThatInclude(id, 0, function(p1) {
                if (EcFramework.relDone[id]) {
                    if (success != null) 
                        success(p1);
                } else {
                    EcFramework.levelDone[id] = true;
                }
            }, failure);
        } else {
            EcFramework.levelDone[id] = true;
        }
    };
    /**
     *  Helper method to remove relationships associated with a competency from this framework
     *  
     *  @memberOf EcFramework
     *  @method removeRelationshipsThatInclude
     *  @private
     *  @param {String} id
     *  			ID of the competency being removed, to find relationships on
     *  @param {int} i
     *  			recursive index parameter
     *  @param {Callback1<String>} success
     *  			Callback triggered after all relationships in the framework have been checked
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs looking through relationships
     */
    prototype.removeRelationshipsThatInclude = function(id, i, success, failure) {
        var shortId = EcRemoteLinkedData.trimVersionFromUrl(id);
        var me = this;
        if (i >= this.relation.length && success != null) 
            success("");
         else 
            EcRepository.get(this.relation[i], function(p1) {
                var a = null;
                try {
                    a = new EcAlignment();
                    a.copyFrom(p1);
                }catch (e) {}
                if (a != null && a.source == shortId || a.target == shortId || a.source == id || a.target == id) {
                    me.relation.splice(i, 1);
                    me.removeRelationshipsThatInclude(id, i, success, failure);
                } else 
                    me.removeRelationshipsThatInclude(id, i + 1, success, failure);
            }, failure);
    };
    /**
     *  Helper method to remove levels associated with a competency from this framework
     *  
     *  @memberOf EcFramework
     *  @method removeLevelsThatInclude
     *  @private
     *  @param {String} id
     *  			ID of the competency being removed, to find levels on
     *  @param {int} i
     *  			recursive index parameter
     *  @param {Callback1<String>} success
     *  			Callback triggered after all levels in the framework have been checked
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs looking through levels
     */
    prototype.removeLevelsThatInclude = function(id, i, success, failure) {
        var shortId = EcRemoteLinkedData.trimVersionFromUrl(id);
        var me = this;
        if (i >= this.level.length && success != null) 
            success("");
         else 
            EcRepository.get(this.level[i], function(p1) {
                var a = new EcLevel();
                a.copyFrom(p1);
                if (a.competency == shortId || a.competency == id) {
                    me.level.splice(i, 1);
                    me.removeLevelsThatInclude(id, i, success, failure);
                } else 
                    me.removeLevelsThatInclude(id, i + 1, success, failure);
            }, failure);
    };
    /**
     *  Adds a relation ID to the framework's list of relations
     *  
     *  @memberOf EcFramework
     *  @method addRelation
     *  @param {String} id
     *  			ID to add to the framework's relation list
     */
    prototype.addRelation = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.relation == null) 
            this.relation = new Array();
        for (var i = 0; i < this.relation.length; i++) 
            if (this.relation[i].equals(id)) 
                return;
        this.relation.push(id);
    };
    /**
     *  Removes a relation ID from the framework's list of relations
     *  
     *  @memberOf EcFramework
     *  @method removeCompetency
     *  @param {String} id
     *  			ID to remove from the framework's relation list
     */
    prototype.removeRelation = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.relation == null) 
            this.relation = new Array();
        for (var i = 0; i < this.relation.length; i++) 
            if (this.relation[i].equals(id)) 
                this.relation.splice(i, 1);
    };
    /**
     *  Adds a level ID to the framework's list of levels
     *  
     *  @memberOf EcFramework
     *  @method addLevel
     *  @param {String} id
     *  			ID of the level to add to framework's list
     */
    prototype.addLevel = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.level == null) 
            this.level = new Array();
        for (var i = 0; i < this.level.length; i++) 
            if (this.level[i].equals(id)) 
                return;
        this.level.push(id);
    };
    /**
     *  Removes a level ID from the framework's list of levels
     *  
     *  @memberOf EcFramework
     *  @method removeLevel
     *  @param {String} id
     *  			ID to remove from framework's level list
     */
    prototype.removeLevel = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.level == null) 
            this.level = new Array();
        for (var i = 0; i < this.level.length; i++) 
            if (this.level[i].equals(id)) 
                this.level.splice(i, 1);
    };
    /**
     *  Adds a rollup rule ID to the framework's list of rollup rules
     *  
     *  @memberOf EcFramework
     *  @method addRollupRule
     *  @param {String} id
     *  			ID of the rollup rule to add
     */
    prototype.addRollupRule = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.rollupRule == null) 
            this.rollupRule = new Array();
        for (var i = 0; i < this.rollupRule.length; i++) 
            if (this.rollupRule[i].equals(id)) 
                return;
        this.rollupRule.push(id);
    };
    /**
     *  Removes a rollup rule ID from the framework's list of rollup rules
     *  
     *  @memberOf EcFramework
     *  @method removeRollupRule
     *  @param {String} id
     *  			ID to remove from rollup rule list
     */
    prototype.removeRollupRule = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.rollupRule == null) 
            this.rollupRule = new Array();
        for (var i = 0; i < this.rollupRule.length; i++) 
            if (this.rollupRule[i].equals(id)) 
                this.rollupRule.splice(i, 1);
    };
    /**
     *  Saves this frameworks details on the server specified by it's ID
     *  
     *  @memberOf EcFramework
     *  @method save
     *  @param {Callback1<String>} success
     *  			Callback triggered after successfully saving the framework
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs while saving the framework
     */
    prototype.save = function(success, failure) {
        if (this.name == null || this.name == "") {
            var msg = "Framework Name Cannot be Empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        EcRepository._save(this, success, failure);
    };
    /**
     *  Deletes this framework from the server specified by it's ID
     *  
     *  @memberOf EcFramework
     *  @method _delete
     *  @param {Callback1<String>} success
     *  			Callback triggered if successfully deleted framework
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs when deleting the framework
     */
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
    /**
     *  Retrieves a framework from the server, specified by the ID
     *  
     *  @memberOf EcFramework
     *  @method get
     *  @static
     *  @param {String} id
     *  			ID of the framework to retrieve
     *  @param {Callback1<EcFramework>} success
     *  			Callback triggered after successfully retrieving the framework,
     *  			returns the retrieved framework
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error occurs while retrieving the framework
     */
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var framework = new EcFramework();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
                EcEncryptedValue.encryptOnSave(p1.id, true);
            }
            if (p1.isAny(framework.getTypes())) {
                framework.copyFrom(p1);
                if (success != null) 
                    success(framework);
            } else {
                var msg = "Resultant object is not a framework.";
                if (failure != null) 
                    failure(msg);
                 else 
                    console.error(msg);
            }
        }, function(p1) {
            if (failure != null) 
                failure(p1);
        });
    };
    /**
     *  Searches the repository given for frameworks using the query passed in
     *  
     *  @memberOf EcFramework
     *  @method search
     *  @static
     *  @param {EcRepository} repo
     *  			Repository to search for frameworks
     *  @param {String} query
     *  			Query string used to search for a framework
     *  @param {Callback1<Array<EcFramework>} success
     *  			Callback triggered when the search successfully returns,
     *  			returns search results
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error occurs while searching
     *  @param {Object} paramObj
     *  			Parameter object for search
     *  		@param size
     *  		@param start
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new EcFramework().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var framework = new EcFramework();
                    if (p1[i].isAny(framework.getTypes())) {
                        framework.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcFramework.myType)) {
                            var obj = val.decryptIntoObject();
                            framework.copyFrom(obj);
                            EcEncryptedValue.encryptOnSave(framework.id, true);
                        }
                    }
                    ret[i] = framework;
                }
                success(ret);
            }
        }, failure);
    };
}, {relDone: {name: "Map", arguments: [null, null]}, levelDone: {name: "Map", arguments: [null, null]}, competency: {name: "Array", arguments: [null]}, relation: {name: "Array", arguments: [null]}, level: {name: "Array", arguments: [null]}, rollupRule: {name: "Array", arguments: [null]}, image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});