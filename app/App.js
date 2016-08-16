import React, {Component} from 'react';
import {render} from 'react-dom';

require("./styles.css");

class App extends Component {
  render() {
    return (
      <Header />
    );
  }
}

class Header extends Component {
  render() {
    return (
      <div>
        <header>
          <h1>️Cover<span>Better</span></h1>
        </header>
        <CoverLetterForm />
        <Footer />
      </div>
    )
  }
}

var CoverLetterForm = React.createClass({
  getInitialState() {
    return {
      company: '',
      location: '',
      title: ''
    }
  },
  saveDraft(event) {
    event.preventDefault();
  },
  setCompanyName(event) {
    this.setState ({
      company: event.target.value
    });
  },
  setLocationName(event) {
    this.setState ({
      location: event.target.value
    });
  },
  setTitleName(event) {
    this.setState ({
      title: event.target.value
    });
  },
  render() {
    return (
      <div>
        <p>
          Create a re-usable cover letter: plug in company name, title and where you found it. Then focus on your cover letter itself. <a href="#more" className="more">What &amp; Why<sup>1</sup></a>
        </p>
        <form onSubmit={this.saveDraft}>
          <fieldset>
            <label>
              <span>Company</span>
              <input type="text" value={this.company} onKeyUp={this.setCompanyName} />
            </label>
            <label>
              <span>Job Title</span>
              <input type="text" value={this.title} onKeyUp={this.setTitleName} />
            </label>
            <label>
              <span>Found On</span>
              <input type="text" value={this.location} onKeyUp={this.setLocationName} />
            </label>
          </fieldset>
        </form>
        <Letter company={this.state.company} title={this.state.title} location={this.state.location} />
      </div>
    )
  }
});

var Letter = React.createClass({
  // getDefaultState() {
  //   return {
  //     company: 'company_name',
  //     location: 'where_you_found_this',
  //     title: 'job_title'
  //   }
  // },
  render() {
    return (
      <div>
        <div contentEditable id="cover-letter">
          Howdy <b className="company" data-blank="company_name">{this.props.company}</b>-folk,
          <br /><br />
          I saw the posting for a <b className="title" data-blank="job_title">{this.props.title}</b> on <b className="location" data-blank="where_you_found_this">{this.props.location}</b> and it immediately struck me as a position I'd love to talk more about!
          <br /><br />
          *** Now, tell them why you rule. ***
          <br /><br />
          *** When you&rsquo;re done, download as a text file. ***
        </div>
        <textarea id="cover-letter-text" style={{display: 'none'}}></textarea>
        <SaveLetter />
      </div>
    )
  }
});

var SaveLetter = React.createClass({
  downloadTextFile(event) {
    var that = event.target;

    setTimeout(function() {
      that.classList = 'submitted';
    }, 125);
    setTimeout(function() {
      var str = '',
          coverLetterContent = document.getElementById('cover-letter'),
          coverLetterTextareaContent = document.getElementById('cover-letter-text'),
          link = document.getElementById('downloadlink');

      str = coverLetterContent.innerHTML.replace(/<br[^>]*>/gi, "\n");
      str = str.replace(/<(?:.|\s)*?>/g, "");

      coverLetterTextareaContent.value = str;

      link.href = makeTextFile(coverLetterTextareaContent.value);
      link.click(); // fake the click, and download the file
    }, 500);
    setTimeout(function() {
      that.classList = '';
      that.blur();
    }, 2000);
  },
  render() {
    return (
      <div className="ender">
        <button onClick={this.downloadTextFile}>Download</button>
        <a download="cover-letter.txt" id="downloadlink" style={{display: 'none'}}>Get that file</a>
      </div>
    )
  }
});

var textFile = null;
var makeTextFile = function (text) {
  var data = new Blob([text], {type: 'text/plain'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile;
};

var Footer = React.createClass({
  render() {
    return (
      <footer id="more">
        <p>
          <strong>What &amp; Why</strong>
          <br />
          I can&rsquo;t be the only person who&rsquo;s re-used certain parts of a cover letter and forgotten to change the company or role. I know: lazy. But also honest, and it happens.
        </p>
        <small>
          &copy; now; passionately made by <a href="http://hire.jefff.co/" target="_blank">jefff</a>.
        </small>
      </footer>
    )
  }
});


// class Foo extends Component {
//   render() {
//     return (
//       <span>fefef</span>
//     );
//   }
// }

// var Foo = React.createClass({
//   render: function(){
//     return (
//       <span>Yo yo yo</span>
//     )
//   }
// });

// function Foo(props) {
//   return (
//     <span></span>
//   )
// }

render(<App />, document.getElementById('root'));
